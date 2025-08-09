<template>
	<div id="blog-wrapper">
		<div
			id="blog-container"
			class="grid grid-cols-1 gap-x-12 gap-y-12 lg:grid-cols-7"
		>
			<div class="space-y-6 lg:col-span-5">
				<div id="blog-list" class="grid gap-4 min-[568px]:grid-cols-2 md:gap-6">
					<a
						v-for="post in blogPosts"
						:key="post.id"
						class="inset-shadow-sm group flex cursor-pointer flex-col overflow-hidden rounded-md border shadow-md dark:shadow-sm dark:shadow-muted"
						:href="`/blog/${post.slug}`"
						:aria-label="post.title"
					>
						<div class="p-3 pb-0">
							<NuxtImg
								v-if="post.coverImage"
								:src="post.coverImage"
								class="h-40 w-full rounded-sm object-cover"
							/>
							<NuxtImg
								v-else
								:src="blankImage"
								class="h-40 w-full rounded-sm bg-muted"
							/>
						</div>

						<div class="flex flex-1 flex-col p-4">
							<div v-if="post.category?.name">
								<Badge>{{ post.category.name }}</Badge>
							</div>
							<h3 class="mb-1 mt-3 line-clamp-2 text-lg font-semibold">
								{{ post.title }}
							</h3>

							<p class="line-clamp-3 flex-1 text-sm text-muted-foreground">
								{{ post.description }}
							</p>

							<div class="mt-4 flex gap-x-2">
								<Avatar class="bg-slate-500">
									<AvatarFallback>CN</AvatarFallback>
								</Avatar>
								<div
									class="flex flex-1 flex-wrap items-center justify-between gap-x-2"
								>
									<span class="text-sm font-medium">
										{{ `${post.author.firstName} ${post.author.lastName}` }}
									</span>
									<span class="text-sm text-muted-foreground">
										{{ dayjs(post.publishedAt).format('MMMM D, YYYY') }}
									</span>
								</div>
							</div>
						</div>
					</a>
				</div>

				<Pagination
					v-if="blogPosts.length"
					:items-per-page="blogPostsPageSize"
					:total="blogPostsTotal"
					show-edges
					:page="searchParams.page"
					@update:page="onPageChange"
					class="flex justify-center"
				>
					<PaginationList v-slot="{ items }" class="flex items-center gap-1">
						<PaginationFirst />
						<PaginationPrev />

						<template v-for="(item, index) in items">
							<PaginationListItem
								v-if="item.type === 'page'"
								:key="index"
								:value="item.value"
								as-child
								:class="[
									'hidden md:inline-flex',
									{
										'inline-flex': item.value === searchParams.page
									}
								]"
							>
								<Button
									class="h-10 w-10 p-0"
									:variant="
										item.value === searchParams.page ? 'default' : 'outline'
									"
								>
									{{ item.value }}
								</Button>
							</PaginationListItem>
							<PaginationEllipsis
								v-else
								:key="item.type"
								class="hidden md:inline-flex"
								:index="index"
							/>
						</template>

						<PaginationNext />
						<PaginationLast />
					</PaginationList>
				</Pagination>
			</div>

			<div class="space-y-8 lg:col-span-2">
				<div class="flex flex-col gap-y-4">
					<h3 class="text-lg font-semibold">Trending Post</h3>
					<a
						v-for="trendingPost in trendingPosts"
						:key="trendingPost.id"
						class="group flex cursor-pointer items-center gap-x-6"
					>
						<Icon
							name="lucide:arrow-right"
							size="18px"
							class="text-muted-foreground transition-all group-hover:translate-x-2 group-hover:text-foreground"
						/>
						<span class="flex-1 text-muted-foreground group-hover:text-primary">
							{{ trendingPost.title }}
						</span>
					</a>
				</div>

				<div>
					<div class="flex flex-col gap-y-4">
						<h3 class="text-lg font-semibold">Most used tag</h3>
						<ul class="flex flex-wrap items-center gap-1 gap-x-1">
							<li
								v-for="tag in topTags?.data"
								:key="tag.id"
								class="[&:nth-last-child(2)]:mr-2"
							>
								<Badge as="a" :href="`/tags/${tag.slug}`">
									{{ tag.name }}
								</Badge>
							</li>
							<li>
								<a
									href="/tags"
									class="text-muted-foreground hover:text-primary"
								>
									SEE ALL
								</a>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import blankImage from '@/assets/images/blank_image.svg'
import Badge from '~/components/ui/badge/Badge.vue'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
	Pagination,
	PaginationEllipsis,
	PaginationFirst,
	PaginationLast,
	PaginationList,
	PaginationListItem,
	PaginationNext,
	PaginationPrev
} from '@/components/ui/pagination'

definePageMeta({
	layout: 'client'
})

const dayjs = useDayjs()
const route = useRoute()
const { $api } = useNuxtApp()
const searchParams = computed(() => {
	return {
		page: route.query.page ? +route.query.page : 1
	}
})
const {
	data: postsData,
	status,
	refresh
} = await useAsyncData('posts-clients', () =>
	$api.posts.getListPostsClient({
		...searchParams.value
	})
)

const { data: topTags } = await useAsyncData('top-tags', () =>
	$api.tags.getTopTags(6)
)

const trendingPosts = [
	{
		id: 1,
		title: 'My Blog Post 1',
		slug: 'my-blog-post-1',
		seoTitle: 'My Blog SEO Title 1',
		seoDescription:
			'Build summer drop many when computer situation material determine by.',
		description:
			'Like to know the secrets of transforming a 2-14 team into a 3x Super Bowl winning Dynasty?',
		coverImage: null,
		status: 'draft',
		publishedAt: '2025-03-09T10:38:58.971Z',
		createdAt: '2025-03-09T10:38:58.971Z',
		updatedAt: '2025-04-05T14:31:07.000Z',
		deletedAt: null,
		views: 610,
		tags: [
			{
				id: 1,
				name: 'Web Development',
				slug: 'web-development',
				color: null,
				createdAt: '2025-02-27T14:49:38.053Z',
				updatedAt: '2025-02-27T14:49:38.053Z',
				deletedAt: null
			}
		],
		author: {
			id: 7,
			firstName: 'Anh',
			lastName: 'Nguyen Tien',
			email: 'tienanh15122001+admin01@gmail.com',
			authProvider: 'email',
			authProviderId: null,
			role: 'admin',
			createdAt: '2025-02-11T16:38:33.015Z',
			updatedAt: '2025-02-11T16:43:04.953Z'
		},
		category: {
			id: 2,
			name: 'Nhiếp ảnh',
			slug: 'nhiep-anh',
			createdAt: '2025-02-26T16:45:53.057Z',
			updatedAt: '2025-02-26T16:45:53.057Z',
			deletedAt: null
		}
	},
	{
		id: 2,
		title:
			'The Impact of Technology on the Workplace: How Technology is Changing',
		slug: 'my-blog-post-2',
		seoTitle: 'My Blog SEO Title 2',
		seoDescription:
			'Memory author remain thousand floor structure public enough heart.',
		description:
			'Like to know the secrets of transforming a 2-14 team into a 3x Super Bowl winning Dynasty? Like to know the secrets of transforming a 2-14 team into a 3x Super Bowl winning Dynasty?',
		coverImage:
			'https://res.cloudinary.com/pe4nuttt-shopdev/image/upload/v1743861925/post/1/cover-image/jvzwxwdsialyv8u7rkfi.jpg',
		status: 'draft',
		publishedAt: '2025-03-11T10:38:58.971Z',
		createdAt: '2025-03-09T10:38:58.971Z',
		updatedAt: '2025-04-05T14:31:07.000Z',
		deletedAt: null,
		views: 410,
		tags: [
			{
				id: 1,
				name: 'Web Development',
				slug: 'web-development',
				color: null,
				createdAt: '2025-02-27T14:49:38.053Z',
				updatedAt: '2025-02-27T14:49:38.053Z',
				deletedAt: null
			}
		],
		author: {
			id: 7,
			firstName: 'Anh',
			lastName: 'Nguyen Tien',
			email: 'tienanh15122001+admin01@gmail.com',
			authProvider: 'email',
			authProviderId: null,
			role: 'admin',
			createdAt: '2025-02-11T16:38:33.015Z',
			updatedAt: '2025-02-11T16:43:04.953Z'
		},
		category: {
			id: 2,
			name: 'Nhiếp ảnh',
			slug: 'nhiep-anh',
			createdAt: '2025-02-26T16:45:53.057Z',
			updatedAt: '2025-02-26T16:45:53.057Z',
			deletedAt: null
		}
	},
	{
		id: 3,
		title: 'My Blog Post 3',
		slug: 'my-blog-post-3',
		seoTitle: 'My Blog SEO Title 3',
		seoDescription: 'Teacher economy deep cost fine because focus effort way.',
		description:
			'Like to know the secrets of transforming a 2-14 team into a 3x Super Bowl winning Dynasty?',
		coverImage:
			'https://res.cloudinary.com/pe4nuttt-shopdev/image/upload/v1743861925/post/1/cover-image/jvzwxwdsialyv8u7rkfi.jpg',
		status: 'published',
		publishedAt: '2025-03-12T10:38:58.971Z',
		createdAt: '2025-03-09T10:38:58.971Z',
		updatedAt: '2025-04-05T14:31:07.000Z',
		deletedAt: null,
		views: 351,
		tags: [
			{
				id: 1,
				name: 'Web Development',
				slug: 'web-development',
				color: null,
				createdAt: '2025-02-27T14:49:38.053Z',
				updatedAt: '2025-02-27T14:49:38.053Z',
				deletedAt: null
			}
		],
		author: {
			id: 7,
			firstName: 'Anh',
			lastName: 'Nguyen Tien',
			email: 'tienanh15122001+admin01@gmail.com',
			authProvider: 'email',
			authProviderId: null,
			role: 'admin',
			createdAt: '2025-02-11T16:38:33.015Z',
			updatedAt: '2025-02-11T16:43:04.953Z'
		},
		category: {
			id: 2,
			name: 'Nhiếp ảnh',
			slug: 'nhiep-anh',
			createdAt: '2025-02-26T16:45:53.057Z',
			updatedAt: '2025-02-26T16:45:53.057Z',
			deletedAt: null
		}
	}
]

const mostViewPosts = [
	{
		id: 1,
		title: 'My Blog Post 1',
		slug: 'my-blog-post-1',
		seoTitle: 'My Blog SEO Title 1',
		seoDescription:
			'Build summer drop many when computer situation material determine by.',
		description:
			'Like to know the secrets of transforming a 2-14 team into a 3x Super Bowl winning Dynasty?',
		coverImage: null,
		status: 'draft',
		publishedAt: '2025-03-09T10:38:58.971Z',
		createdAt: '2025-03-09T10:38:58.971Z',
		updatedAt: '2025-04-05T14:31:07.000Z',
		deletedAt: null,
		views: 610,
		tags: [
			{
				id: 1,
				name: 'Web Development',
				slug: 'web-development',
				color: null,
				createdAt: '2025-02-27T14:49:38.053Z',
				updatedAt: '2025-02-27T14:49:38.053Z',
				deletedAt: null
			}
		],
		author: {
			id: 7,
			firstName: 'Anh',
			lastName: 'Nguyen Tien',
			email: 'tienanh15122001+admin01@gmail.com',
			authProvider: 'email',
			authProviderId: null,
			role: 'admin',
			createdAt: '2025-02-11T16:38:33.015Z',
			updatedAt: '2025-02-11T16:43:04.953Z'
		},
		category: {
			id: 2,
			name: 'Nhiếp ảnh',
			slug: 'nhiep-anh',
			createdAt: '2025-02-26T16:45:53.057Z',
			updatedAt: '2025-02-26T16:45:53.057Z',
			deletedAt: null
		}
	},
	{
		id: 2,
		title:
			'The Impact of Technology on the Workplace: How Technology is Changing',
		slug: 'my-blog-post-2',
		seoTitle: 'My Blog SEO Title 2',
		seoDescription:
			'Memory author remain thousand floor structure public enough heart.',
		description:
			'Like to know the secrets of transforming a 2-14 team into a 3x Super Bowl winning Dynasty? Like to know the secrets of transforming a 2-14 team into a 3x Super Bowl winning Dynasty?',
		coverImage:
			'https://res.cloudinary.com/pe4nuttt-shopdev/image/upload/v1743861925/post/1/cover-image/jvzwxwdsialyv8u7rkfi.jpg',
		status: 'draft',
		publishedAt: '2025-03-11T10:38:58.971Z',
		createdAt: '2025-03-09T10:38:58.971Z',
		updatedAt: '2025-04-05T14:31:07.000Z',
		deletedAt: null,
		views: 410,
		tags: [
			{
				id: 1,
				name: 'Web Development',
				slug: 'web-development',
				color: null,
				createdAt: '2025-02-27T14:49:38.053Z',
				updatedAt: '2025-02-27T14:49:38.053Z',
				deletedAt: null
			}
		],
		author: {
			id: 7,
			firstName: 'Anh',
			lastName: 'Nguyen Tien',
			email: 'tienanh15122001+admin01@gmail.com',
			authProvider: 'email',
			authProviderId: null,
			role: 'admin',
			createdAt: '2025-02-11T16:38:33.015Z',
			updatedAt: '2025-02-11T16:43:04.953Z'
		},
		category: {
			id: 2,
			name: 'Nhiếp ảnh',
			slug: 'nhiep-anh',
			createdAt: '2025-02-26T16:45:53.057Z',
			updatedAt: '2025-02-26T16:45:53.057Z',
			deletedAt: null
		}
	},
	{
		id: 3,
		title: 'My Blog Post 3',
		slug: 'my-blog-post-3',
		seoTitle: 'My Blog SEO Title 3',
		seoDescription: 'Teacher economy deep cost fine because focus effort way.',
		description:
			'Like to know the secrets of transforming a 2-14 team into a 3x Super Bowl winning Dynasty?',
		coverImage:
			'https://res.cloudinary.com/pe4nuttt-shopdev/image/upload/v1743861925/post/1/cover-image/jvzwxwdsialyv8u7rkfi.jpg',
		status: 'published',
		publishedAt: '2025-03-12T10:38:58.971Z',
		createdAt: '2025-03-09T10:38:58.971Z',
		updatedAt: '2025-04-05T14:31:07.000Z',
		deletedAt: null,
		views: 351,
		tags: [
			{
				id: 1,
				name: 'Web Development',
				slug: 'web-development',
				color: null,
				createdAt: '2025-02-27T14:49:38.053Z',
				updatedAt: '2025-02-27T14:49:38.053Z',
				deletedAt: null
			}
		],
		author: {
			id: 7,
			firstName: 'Anh',
			lastName: 'Nguyen Tien',
			email: 'tienanh15122001+admin01@gmail.com',
			authProvider: 'email',
			authProviderId: null,
			role: 'admin',
			createdAt: '2025-02-11T16:38:33.015Z',
			updatedAt: '2025-02-11T16:43:04.953Z'
		},
		category: {
			id: 2,
			name: 'Nhiếp ảnh',
			slug: 'nhiep-anh',
			createdAt: '2025-02-26T16:45:53.057Z',
			updatedAt: '2025-02-26T16:45:53.057Z',
			deletedAt: null
		}
	}
]
const blogPosts = computed(() => postsData.value?.data?.items ?? [])
const blogPostsTotal = computed(() => postsData.value?.data.totalCount ?? 0)
const blogPostsPageSize = computed(() => postsData.value?.data.limit ?? 0)

const onPageChange = async (page: number) => {
	if (page && page === searchParams.value.page) return

	const query: Record<string, any> = { ...route.query, page }
	if (page === 1) {
		delete query.page
	}
	await navigateTo({ path: route.path, query })
	refresh()
}
</script>

<style scoped></style>
