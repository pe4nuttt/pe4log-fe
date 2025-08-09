<template>
	<div class="flex h-full flex-col space-y-4">
		<div class="flex flex-wrap items-center justify-between gap-x-4">
			<div>
				<h2 class="text-3xl font-bold tracking-tight">Categories</h2>
				<p class="text-sm text-muted-foreground">Manage your categories here</p>
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
				placeholder="Search categories"
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
				:row-data="categoriesListData"
				:columns="colDefs"
				dom-layout="normal"
				@row-clicked="
					(data: ICategory[]) => {
						console.log(data)
					}
				"
				@sort-changed="onSortChange"
			/>
			<Separator class="mt-6" />
			<TablePagination
				v-model:page-num="searchParams.page"
				v-model:page-size="searchParams.limit"
				class="mt-2"
				:total-items="categoriesListTotal"
				@update:page-size="onPageSizeChange"
				@update:page-num="onPageNumChange"
			/>
		</div>

		<CategoryFormDialog
			v-model:open="openFormDialog"
			:type="formDialogType"
			:category="selectedCategory"
			@save-success="onSavedCategory"
		/>
		<CategoryDeleteDialog
			v-model:open="openDeleteDialog"
			:category="selectedCategory"
			@delete-success="onDeletedCategory"
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
import type {
	ICategory,
	IParamsGetListCategories,
	ITableSortChangeData
} from '~/types'
import { EEntityFormType } from '~/types'
import type { ColDef } from 'ag-grid-community'
import { useDebounceFn } from '@vueuse/core'
import CategoryFormDialog from '~/components/pages/admin/categories/CategoryFormDialog.vue'
import CategoryDeleteDialog from '~/components/pages/admin/categories/CategoryDeleteDialog.vue'
import CellRenderUpdateDeleteDropdown from '~/components/cellRenderer/CellRenderUpdateDeleteDropdown.vue'

definePageMeta({
	// layout: 'admin',
	middleware: ['auth']
})

interface ISearchParamsGetListCategories extends IParamsGetListCategories {
	search: string
	page: number
	limit: number
}

const { $api } = useNuxtApp()
const dayjs = useDayjs()

const searchParams = ref<ISearchParamsGetListCategories>({
	page: 1,
	limit: 10,
	search: '',
	order: undefined,
	sortBy: undefined
})

const openFormDialog = ref(false)
const openDeleteDialog = ref(false)
const formDialogType = ref<EEntityFormType>(EEntityFormType.ADD)
const selectedCategory = ref<ICategory | null>(null)

const { data, status, refresh } = await useAsyncData('categories', () =>
	$api.categories.getListCategories(searchParams.value)
)

const colDefs = ref<ColDef<ICategory>[]>([
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
		sortable: false,
		cellRendererSelector: (params) => {
			return {
				component: CellRenderUpdateDeleteDropdown
			}
		}
	}
])
const context = ref({})

const handleRefreshCategoriesList = useDebounceFn(() => {
	refresh()
}, 300)

const handleResetFilter = () => {
	searchParams.value.search = ''
}

const onSortChange = (sortData: ITableSortChangeData) => {
	searchParams.value.order = sortData.order
	searchParams.value.sortBy = sortData.sortBy

	handleRefreshCategoriesList()
}

const onPageSizeChange = () => {
	searchParams.value.page = 1
	refresh()
}

const onPageNumChange = () => {
	refresh()
}

const onSavedCategory = () => {
	openFormDialog.value = false
	selectedCategory.value = null
	refresh()
}

const onDeletedCategory = () => {
	openDeleteDialog.value = false
	selectedCategory.value = null
	refresh()
}

const onClickCreate = () => {
	formDialogType.value = EEntityFormType.ADD
	openFormDialog.value = true
}

const onClickEdit = (category: ICategory) => {
	formDialogType.value = EEntityFormType.EDIT
	selectedCategory.value = category
	openFormDialog.value = true
}
const onClickDelete = (category: ICategory) => {
	selectedCategory.value = category
	openDeleteDialog.value = true
}

const categoriesListData = computed(() => data.value?.data?.items ?? [])
const categoriesListTotal = computed(() => data.value?.data.totalCount ?? 0)
const isFetchingList = computed(() => status.value === 'pending')

watch(
	() => [searchParams.value.search],
	() => {
		handleRefreshCategoriesList()
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
