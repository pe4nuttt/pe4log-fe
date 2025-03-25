<template>
	<div class="flex h-full flex-col space-y-4">
		<div class="flex flex-wrap items-center justify-between gap-x-4">
			<div>
				<h2 class="text-3xl font-bold tracking-tight">Posts</h2>
				<p class="text-sm text-muted-foreground">Manage your posts here</p>
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
			<div>
				<Label for="search" class="font-normal">Search</Label>
				<Input
					id="search"
					v-model="searchParams.search"
					type="text"
					placeholder="Search posts"
					class="h-8 w-48 lg:w-[250px]"
				/>
			</div>

			<div>
				<Label for="search" class="font-normal">Search</Label>
				<Input
					id="search"
					v-model="searchParams.search"
					type="text"
					placeholder="Search posts"
					class="h-8 w-48 lg:w-[250px]"
				/>
			</div>
			<!-- <Button variant="ghost" size="sm" @click="handleResetFilter">
				Reset Filters
				<X />
			</Button> -->
		</div>

		<div class="flex flex-1 flex-col">
			<GridVx
				:context="context"
				:loading="isFetchingList"
				:row-data="postListData"
				:columns="colDefs"
				dom-layout="normal"
				@row-clicked="(data: IPost[]) => {}"
				@sort-changed="onSortChange"
			/>
			<Separator class="mt-6" />
			<TablePagination
				v-model:page-num="searchParams.page"
				v-model:page-size="searchParams.limit"
				class="mt-2"
				:total-items="postListTotal"
				@update:page-size="onPageSizeChange"
				@update:page-num="onPageNumChange"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { Plus, X } from 'lucide-vue-next'
import { Button } from '~/components/ui/button'
import { Separator } from '~/components/ui/separator'
import { Input } from '@/components/ui/input'
import { GridVx } from '~/components/ui/grid-vx/'
import { TablePagination } from '~/components/ui/table-pagination'
import type { IPost, IParamsGetListTags, ITableSortChangeData } from '~/types'
import type { ColDef } from 'ag-grid-community'
import { useDebounceFn } from '@vueuse/core'
import CellRenderUpdateDeleteDropdown from '~/components/cellRenderer/CellRenderUpdateDeleteDropdown.vue'
import Label from '~/components/ui/label/Label.vue'

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

const openDeleteDialog = ref(false)
const selectedPost = ref<IPost | null>(null)

const { data, status, refresh } = await useAsyncData('posts', () =>
	$api.posts.getListPosts(searchParams.value)
)

const colDefs = ref<ColDef<IPost>[]>([
	{
		headerName: 'Title',
		field: 'title',
		tooltipField: 'title',
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

const onDeletedPost = () => {
	openDeleteDialog.value = false
	selectedPost.value = null
	refresh()
}

const onClickCreate = () => {}

const onClickEdit = (post: IPost) => {}
const onClickDelete = (post: IPost) => {
	selectedPost.value = post
	openDeleteDialog.value = true
}

const postListData = computed(() => data.value?.data?.items ?? [])
const postListTotal = computed(() => data.value?.data.totalCount ?? 0)
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
