<template>
	<div class="flex h-full flex-col space-y-4">
		<div class="flex flex-wrap items-center justify-between gap-x-4">
			<div>
				<h2 class="text-3xl font-bold tracking-tight">Posts</h2>
				<p class="text-sm text-muted-foreground">Manage your posts here</p>
			</div>
			<div class="flex gap-2">
				<Button :disabled="isGeneratingNewPost" @click="onClickCreate">
					<Loader v-if="isGeneratingNewPost" />
					Create
					<Plus />
				</Button>
			</div>
		</div>

		<FilterCollapse default-open header-class="items-end" class="!mt-1.5">
			<template #header-left>
				<Tabs v-model="currentTab">
					<TabsList>
						<TabsTrigger
							v-for="item in tabList"
							:key="item.value"
							:value="item.value"
						>
							{{ item.label }}
						</TabsTrigger>
					</TabsList>
				</Tabs>
			</template>

			<template #default>
				<div class="space-y-4">
					<div class="grid grid-cols-12 items-center gap-x-2 gap-y-2">
						<div class="col-span-12 md:col-span-4 lg:col-span-3">
							<Label for="search" class="font-normal">Search</Label>
							<Input
								id="search"
								v-model="searchParams.search"
								type="text"
								placeholder="Search posts"
								class="h-8"
							/>
						</div>

						<div class="col-span-12 md:col-span-4 lg:col-span-3">
							<Label for="status" class="font-normal">Status</Label>
							<Select v-model="searchParams.status">
								<SelectTrigger id="status" name="status">
									<SelectValue placeholder="Select a status" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem :value="null">All</SelectItem>
									<SelectItem
										v-for="item in statusOptions"
										:key="item.value"
										:value="item.value"
									>
										{{ item.label }}
									</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div class="col-span-12 md:col-span-4 lg:col-span-3">
							<Label for="category" class="font-normal">Categories</Label>
							<Select v-model="searchParams.categoryId">
								<SelectTrigger id="category" name="category">
									<SelectValue placeholder="Select a category" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem :value="null">All</SelectItem>
									<SelectItem
										v-for="item in listCategoryOptions"
										:key="item.value"
										:value="item.value"
									>
										{{ item.label }}
									</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div class="col-span-12 md:col-span-4 lg:col-span-3">
							<Label for="tag" class="font-normal">Tags</Label>
							<MultiSelect
								id="tag"
								v-model="searchParams.tagIds"
								:options="listTagOptions"
								:max-count="1"
								type="text"
								placeholder="Select tags"
								class="min-h-8"
							/>
						</div>

						<div class="col-span-12 md:col-span-8 lg:col-span-6">
							<Label for="search" class="font-normal">Created at</Label>
							<CalendarRangeInput v-model="createdAtRanges" />
						</div>
						<!-- <Button variant="ghost" size="sm" @click="handleResetFilter">
				Reset Filters
				<X />
			</Button> -->
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

		<div class="flex flex-1 flex-col">
			<GridVx
				v-show="currentTab === 'list'"
				:context="context"
				:loading="isFetchingList"
				:row-data="postListData"
				:columns="colDefs"
				dom-layout="normal"
				@row-clicked="(data: IPost[]) => {}"
				@sort-changed="onSortChange"
			/>

			<PostGalleryView
				v-show="currentTab === 'gallery'"
				:posts="postListData"
				:loading="isFetchingList"
				@edit="onClickEdit"
				@delete="onClickDelete"
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
import {
	type IPost,
	type IParamsGetListTags,
	type ITableSortChangeData,
	EPostStatus,
	type IParamsGetListPosts
} from '~/types'
import type { ColDef } from 'ag-grid-community'
import { useDebounceFn } from '@vueuse/core'
import CellRenderUpdateDeleteDropdown from '~/components/cellRenderer/CellRenderUpdateDeleteDropdown.vue'
import Label from '~/components/ui/label/Label.vue'
import { CalendarRangeInput } from '~/components/ui/calendar-select'
import { MultiSelect } from '~/components/ui/multi-select'
import CellRenderTags from '~/components/cellRenderer/CellRenderTags.vue'
import FilterCollapse from '~/components/layout/admin/FilterCollapse.vue'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import PostGalleryView from '~/components/pages/admin/posts/PostGalleryView.vue'

definePageMeta({
	// layout: 'admin',
	middleware: ['auth']
})

interface ISearchParamsGetListPosts extends IParamsGetListPosts {
	search: string
	page: number
	limit: number
}

const { $api, $vxConfirm } = useNuxtApp()
const dayjs = useDayjs()
const { toastSuccess, toastError } = useAppToast()

const tabList = [
	{
		label: 'List view',
		value: 'list'
	},
	{
		label: 'Gallery view',
		value: 'gallery'
	}
]
const searchParams = ref<ISearchParamsGetListPosts>({
	page: 1,
	limit: 10,
	search: '',
	order: undefined,
	sortBy: undefined,
	categoryId: undefined,
	tagIds: undefined,
	authorId: undefined,
	status: undefined
})
const createdAtRanges = ref({
	start: '',
	end: ''
})
const { data, status, refresh } = await useAsyncData('posts', () =>
	$api.posts.getListPosts({
		...searchParams.value,
		createdAtFrom: createdAtRanges.value.start
			? dayjs(createdAtRanges.value.start).format('YYYY-MM-DD')
			: undefined,
		createdAtTo: createdAtRanges.value.end
			? dayjs(createdAtRanges.value.end).format('YYYY-MM-DD')
			: undefined
	})
)
const { data: listTags, status: getListTagsStatus } = await useAsyncData(() =>
	$api.tags.getListTags({
		all: true
	})
)
const { data: listCategories, status: getListCategoriesStatus } =
	await useAsyncData(() =>
		$api.categories.getListCategories({
			all: true
		})
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
		headerName: 'Tags',
		minWidth: 200,
		width: 200,
		autoHeight: true,
		cellClass: 'flex items-center',
		cellRendererSelector: (params) => {
			return {
				component: CellRenderTags,
				params: { tags: params.data?.tags ?? [] }
			}
		}
	},
	{
		headerName: 'Category',
		field: 'category',
		valueGetter: (params) => params.data?.category?.name ?? '-',
		minWidth: 200,
		width: 200
	},
	{
		headerName: 'Status',
		field: 'status',
		valueFormatter: (params) => capitalizeFirstLetter(params.value),
		minWidth: 150,
		width: 150
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
const currentTab = ref('list')
const context = ref({})
const statusOptions = [
	{
		label: 'Draft',
		value: EPostStatus.DRAFT
	},
	{
		label: 'Published',
		value: EPostStatus.PUBLISHED
	},
	{
		label: 'Archived',
		value: EPostStatus.ARCHIVED
	}
]
const isGeneratingNewPost = ref(false)

const listCategoryOptions = computed(() => {
	return (
		listCategories.value?.data?.items.map((category) => ({
			label: category.name,
			value: category.id
		})) ?? []
	)
})

const listTagOptions = computed(() => {
	return (
		listTags.value?.data?.items.map((tag) => ({
			label: tag.name,
			value: tag.id
		})) ?? []
	)
})

// Methods
const handleRefreshTagsList = useDebounceFn(() => {
	refresh()
}, 300)

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

const onClickCreate = async () => {
	try {
		isGeneratingNewPost.value = true
		const res = await $api.posts.generateNewPost()
		if (res.data) {
			navigateTo({
				path: `/admin/posts/${res.data.id}`,
				query: {
					showSetting: 'true'
				}
			})
		}
	} catch (error) {
		toastError(error)
	} finally {
		isGeneratingNewPost.value = false
	}
}
const onClickEdit = (post: IPost) => {
	navigateTo(`/admin/posts/${post.id}`)
}
const onClickDelete = (post: IPost) => {
	$vxConfirm('Are you sure you want to delete this post?', {
		title: `Delete ${post.title} post`,
		type: 'confirm',
		resolve: async () => {
			try {
				const res = await $api.posts.deletePost(post.id)
				toastSuccess(res.message)
				refresh()
			} catch (error) {
				toastError(error)
			}
		}
	})
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
		categoryId: undefined,
		tagIds: undefined,
		authorId: undefined,
		status: undefined
	}
	createdAtRanges.value = {
		start: '',
		end: ''
	}
	refresh()
}

const postListData = computed(() => data.value?.data?.items ?? [])
const postListTotal = computed(() => data.value?.data.totalCount ?? 0)
const isFetchingList = computed(() => status.value === 'pending')
const isLoading = computed(
	() =>
		isFetchingList.value ||
		getListTagsStatus.value === 'pending' ||
		getListCategoriesStatus.value === 'pending'
)

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
