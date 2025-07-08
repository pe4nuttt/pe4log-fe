<template>
	<div class="flex h-full flex-col space-y-4">
		<div class="flex flex-wrap items-center justify-between gap-x-4">
			<div>
				<h2 class="text-3xl font-bold tracking-tight">Users</h2>
				<p class="text-sm text-muted-foreground">Manage your users here</p>
			</div>
			<div class="flex gap-2">
				<Button @click="onClickCreate">
					Create
					<Plus />
				</Button>
			</div>
		</div>

		<FilterCollapse default-open header-class="items-end" class="!mt-1.5">
			<template #default>
				<div class="space-y-4">
					<div class="grid grid-cols-12 items-center gap-x-2 gap-y-2 pl-[1px]">
						<div class="col-span-12 md:col-span-4">
							<Label for="search" class="font-normal">Search</Label>
							<Input
								id="search"
								v-model="searchParams.search"
								type="text"
								placeholder="Search posts"
								class="h-8"
							/>
						</div>

						<div class="col-span-12 md:col-span-4">
							<Label for="role" class="font-normal">Role</Label>
							<Select v-model="searchParams.role">
								<SelectTrigger id="role" name="role">
									<SelectValue placeholder="Select a role" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem :value="null">All</SelectItem>
									<SelectItem
										v-for="item in USER_ROLE_OPTIONS"
										:key="item.value"
										:value="item.value"
									>
										{{ item.label }}
									</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div class="col-span-12 md:col-span-4">
							<Label for="status" class="font-normal">Status</Label>
							<Select v-model="searchParams.status">
								<SelectTrigger id="status" name="status">
									<SelectValue placeholder="Select a status" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem :value="null">All</SelectItem>
									<SelectItem
										v-for="item in USER_STATUS_OPTIONS"
										:key="item.value"
										:value="item.value"
									>
										{{ item.label }}
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					<div class="flex items-center justify-center gap-2">
						<Button class="h-8" @click="onApplyFilters">Apply filters</Button>
						<Button class="h-8" variant="secondary" @click="onClearFilters">
							Reset
						</Button>
					</div>
				</div>
			</template>
		</FilterCollapse>

		<!-- <Separator /> -->

		<div class="flex flex-1 flex-col">
			<GridVx
				:context="context"
				:loading="isFetchingList"
				:row-data="userListData"
				:columns="colDefs"
				dom-layout="normal"
				@sort-changed="onSortChange"
			/>
			<Separator class="mt-6" />
			<TablePagination
				v-model:page-num="searchParams.page"
				v-model:page-size="searchParams.limit"
				class="mt-2"
				:total-items="userListTotal"
				@update:page-size="onPageSizeChange"
				@update:page-num="onPageNumChange"
			/>
		</div>

		<UserFormDialog
			v-model:open="openFormDialog"
			:type="formDialogType"
			:user="selectedUser"
			@save-success="onSavedUser"
			@refresh-list="refresh"
		/>
	</div>
</template>

<script setup lang="ts">
import { Plus, X } from 'lucide-vue-next'
import { Button } from '~/components/ui/button'
import { Separator } from '~/components/ui/separator'
import { Input } from '@/components/ui/input'
import { GridVx } from '~/components/ui/grid-vx/'
import { TablePagination } from '~/components/ui/table-pagination'
import type { IUser, IParamsGetListUsers, ITableSortChangeData } from '~/types'
import { EEntityFormType, EUserStatus } from '~/types'
import type { ColDef } from 'ag-grid-community'
import { useDebounceFn } from '@vueuse/core'
import UserFormDialog from '~/components/pages/admin/users/UserFormDialog.vue'
import CellRenderUpdateDeleteDropdown from '~/components/cellRenderer/CellRenderUpdateDeleteDropdown.vue'
import CellRenderSwitch from '~/components/cellRenderer/CellRenderSwitch.vue'
import FilterCollapse from '~/components/layout/admin/FilterCollapse.vue'
import { USER_ROLE_OPTIONS, USER_STATUS_OPTIONS } from '~/utils/constants'

definePageMeta({
	layout: 'admin',
	middleware: ['auth']
})

interface ISearchParamsGetListUsers extends IParamsGetListUsers {
	search: string
	page: number
	limit: number
}

const { $api, $vxConfirm } = useNuxtApp()
const dayjs = useDayjs()
const { toastSuccess, toastError } = useAppToast()

const searchParams = ref<ISearchParamsGetListUsers>({
	page: 1,
	limit: 10,
	search: '',
	order: undefined,
	sortBy: undefined,
	role: undefined,
	status: undefined
})

const openFormDialog = ref(false)
const formDialogType = ref<EEntityFormType>(EEntityFormType.ADD)
const selectedUser = ref<IUser | null>(null)

const { data, status, refresh } = await useAsyncData('users', () =>
	$api.users.getListUsers(searchParams.value)
)

const colDefs = ref<
	ColDef<
		IUser & {
			fullName: string
		}
	>[]
>([
	{
		headerName: 'Name',
		field: 'fullName',
		valueGetter: (params) => {
			const user = params.data as IUser
			return `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim()
		},
		tooltipValueGetter: (params) => {
			const user = params.data as IUser
			return `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim()
		},
		minWidth: 200,
		width: 200
	},
	{
		headerName: 'Email',
		field: 'email',
		tooltipField: 'email',
		minWidth: 200,
		width: 200
	},
	{
		headerName: 'Role',
		field: 'role',
		valueGetter: (params) => {
			const user = params.data as IUser
			return capitalizeFirstLetter(user.role)
		},
		minWidth: 120,
		width: 120
	},
	{
		headerName: 'Status',
		field: 'status',
		// cellRenderer: (params: any) => {
		// 	return `<span>${capitalizeFirstLetter(params.value)}</span>`
		// },
		// cellClass: (params) => {
		// 	return params.value === EUserStatus.ACTIVE
		// 		? 'text-green-600'
		// 		: 'text-destructive'
		// },
		valueGetter: (params) => params.data?.status === EUserStatus.ACTIVE,
		cellRendererSelector: (params) => {
			return {
				component: CellRenderSwitch
			}
		},
		minWidth: 120,
		width: 120
	},
	{
		headerName: 'Created At',
		field: 'createdAt',
		valueGetter: (params) =>
			params.data?.createdAt
				? dayjs(params.data?.createdAt).format('YYYY-MM-DD HH:mm:ss')
				: '-',
		minWidth: 190
	},
	{
		headerName: '',
		minWidth: 80,
		width: 80,
		cellClass: 'flex justify-center',
		sortable: false,
		cellRendererSelector: () => ({
			component: CellRenderUpdateDeleteDropdown
		})
	}
])
const context = ref({})

const handleRefreshUsersList = useDebounceFn(() => {
	searchParams.value.page = 1
	refresh()
}, 300)

const onSortChange = (sortData: ITableSortChangeData) => {
	searchParams.value.order = sortData.order
	searchParams.value.sortBy = sortData.sortBy
	handleRefreshUsersList()
}

const onPageSizeChange = () => {
	searchParams.value.page = 1
	refresh()
}

const onPageNumChange = () => {
	refresh()
}

const onSavedUser = () => {
	openFormDialog.value = false
	selectedUser.value = null
	refresh()
}

const onClickCreate = () => {
	formDialogType.value = EEntityFormType.ADD
	selectedUser.value = null
	openFormDialog.value = true
}

const onClickEdit = (user: IUser) => {
	formDialogType.value = EEntityFormType.EDIT
	selectedUser.value = user
	openFormDialog.value = true
}

const onClickDelete = async (user: IUser) => {
	$vxConfirm(`Are you sure you want to delete user "${user.email}"?`, {
		title: `Delete ${user.email} post`,
		type: 'confirm',
		resolve: async () => {
			try {
				const res = await $api.users.deleteUser(user.id)
				toastSuccess(res.message)
				refresh()
			} catch (error) {
				toastError(error)
			}
		}
	})
}

const onToggleStatus = async (value: boolean, user: IUser) => {
	try {
		const res = await $api.users.editUser(user.id, {
			...user,
			status: value ? EUserStatus.ACTIVE : EUserStatus.INACTIVE
		})
		toastSuccess(res.message)
		refresh()
	} catch (error) {
		toastError(error)
	}
}

const onApplyFilters = () => {
	searchParams.value.page = 1
	refresh()
}

const onClearFilters = () => {
	searchParams.value = {
		page: 1,
		limit: 10,
		search: '',
		order: undefined,
		sortBy: undefined,
		role: undefined,
		status: undefined
	}
	refresh()
}

const userListData = computed(() => data.value?.data?.items ?? [])
const userListTotal = computed(() => data.value?.data.totalCount ?? 0)
const isFetchingList = computed(() => status.value === 'pending')

watch(
	() => [searchParams.value.search],
	() => {
		handleRefreshUsersList()
	}
)

onBeforeMount(() => {
	context.value = {
		componentParent: {
			onClickCellEdit: onClickEdit,
			onClickCellDelete: onClickDelete,
			onToggleCellSwitch: onToggleStatus
		}
	}
})
</script>

<style scoped></style>
