<template>
	<div class="flex h-full flex-col space-y-4">
		<div class="flex flex-wrap items-center justify-between gap-x-4">
			<div>
				<h2 class="text-3xl font-bold tracking-tight">Tags</h2>
				<p class="text-sm text-muted-foreground">Manage your tags here</p>
			</div>
			<div class="flex gap-2">
				<Button @click="onClickCreate">
					Create
					<Plus />
				</Button>
			</div>
		</div>
		<Separator />

		<div class="flex flex-wrap items-center gap-x-2">
			<Input
				v-model="searchParams.search"
				type="text"
				placeholder="Search tags"
				class="h-8 w-40 lg:w-[250px]"
			/>
			<Button variant="ghost" size="sm" @click="handleResetFilter">
				Reset Filters
				<X />
			</Button>
		</div>

		<div class="flex flex-1 flex-col">
			<GridVx
				:context="context"
				:loading="isFetchingList"
				:row-data="tagListData"
				:columns="colDefs"
				dom-layout="normal"
				@row-clicked="(data: ITag[]) => {}"
				@sort-changed="onSortChange"
			/>
			<Separator class="mt-6" />
			<TablePagination
				v-model:page-num="searchParams.page"
				v-model:page-size="searchParams.limit"
				class="mt-2"
				:total-items="tagListTotal"
				@update:page-size="onPageSizeChange"
				@update:page-num="onPageNumChange"
			/>
		</div>

		<TagFormDialog
			v-model:open="openFormDialog"
			:type="formDialogType"
			:tag="selectedTag"
			@save-success="onSavedTag"
		/>
		<TagDeleteDialog
			v-model:open="openDeleteDialog"
			:tag="selectedTag"
			@delete-success="onDeletedTag"
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
import type { ITag, IParamsGetListTags, ITableSortChangeData } from '~/types'
import { EEntityFormType } from '~/types'
import type { ColDef } from 'ag-grid-community'
import { useDebounceFn } from '@vueuse/core'
import TagFormDialog from '~/components/pages/admin/tags/TagFormDialog.vue'
import TagDeleteDialog from '~/components/pages/admin/tags/TagDeleteDialog.vue'
import CellRenderUpdateDeleteDropdown from '~/components/cellRenderer/CellRenderUpdateDeleteDropdown.vue'

definePageMeta({
	layout: 'admin',
	middleware: ['auth']
})

interface ISearchParamsGetListTags extends IParamsGetListTags {
	search: string
	page: number
	limit: number
}

const { $api } = useNuxtApp()
const dayjs = useDayjs()

const searchParams = ref<ISearchParamsGetListTags>({
	page: 1,
	limit: 10,
	search: '',
	order: undefined,
	sortBy: undefined
})

const openFormDialog = ref(false)
const openDeleteDialog = ref(false)
const formDialogType = ref<EEntityFormType>(EEntityFormType.ADD)
const selectedTag = ref<ITag | null>(null)

const { data, status, refresh } = await useAsyncData('tags', () =>
	$api.tags.getListTags(searchParams.value)
)

const colDefs = ref<ColDef<ITag>[]>([
	{
		headerName: 'Name',
		field: 'name',
		tooltipField: 'name',
		minWidth: 200,
		width: 200
	},
	{
		headerName: 'Slug',
		field: 'slug',
		tooltipField: 'slug',
		minWidth: 200,
		width: 200
	},
	{
		headerName: 'Color',
		field: 'color',
		cellRenderer: (params: any) => {
			const colorLabel = getTagLabelByColor(params.value)
			return `<div class="flex items-center gap-1">
			<div 
				style="color: ${params.value ?? 'inherit'}; background: ${params.value ? getTagBackgroundFromColor(params.value) : 'unset'}"
				class="mr-2 rounded-2xl border-[1px] border-muted px-2 py-[3px] text-xs font-medium leading-4'
			>
				Tag
			</div>
			${colorLabel ?? 'Default'}</div>`
		},
		minWidth: 200,
		width: 200
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
		headerName: 'Updated At',
		field: 'updatedAt',
		valueGetter: (params) =>
			params.data?.updatedAt
				? dayjs(params.data?.updatedAt).format('YYYY-MM-DD HH:mm:ss')
				: '-',
		minWidth: 190
	},
	{
		headerName: '',
		minWidth: 80,
		width: 80,
		cellClass: 'flex justify-center',
		cellRendererSelector: (params) => {
			return {
				component: CellRenderUpdateDeleteDropdown
			}
		}
	}
])
const context = ref({})

const handleRefreshTagsList = useDebounceFn(() => {
	refresh()
}, 300)

const handleResetFilter = () => {
	searchParams.value.search = ''
}

const onSortChange = (sortData: ITableSortChangeData) => {
	searchParams.value.order = sortData.order
	searchParams.value.sortBy = sortData.sortBy

	handleRefreshTagsList()
}

const onPageSizeChange = () => {
	searchParams.value.page = 1
	refresh()
}

const onPageNumChange = () => {
	refresh()
}

const onSavedTag = () => {
	openFormDialog.value = false
	selectedTag.value = null
	refresh()
}

const onDeletedTag = () => {
	openDeleteDialog.value = false
	selectedTag.value = null
	refresh()
}

const onClickCreate = () => {
	formDialogType.value = EEntityFormType.ADD
	openFormDialog.value = true
}

const onClickEdit = (tag: ITag) => {
	formDialogType.value = EEntityFormType.EDIT
	selectedTag.value = tag
	openFormDialog.value = true
}
const onClickDelete = (tag: ITag) => {
	selectedTag.value = tag
	openDeleteDialog.value = true
}

const tagListData = computed(() => data.value?.data?.items ?? [])
const tagListTotal = computed(() => data.value?.data.totalCount ?? 0)
const isFetchingList = computed(() => status.value === 'pending')

watch(
	() => [searchParams.value.search],
	() => {
		handleRefreshTagsList()
	}
)

onBeforeMount(() => {
	context.value = {
		componentParent: {
			onClickCellEdit: onClickEdit,
			onClickCellDelete: onClickDelete
		}
	}
})
</script>

<style scoped></style>
