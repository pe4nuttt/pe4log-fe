<template>
	<main>
		<article class="space-y-6">
			<div class="w-full max-w-3xl space-y-4">
				<h1 class="text-3xl font-bold md:text-4xl">
					{{ postDetails?.title }}
				</h1>

				<p class="">
					{{ postDetails?.description }}
				</p>

				<div class="mt-4 flex gap-x-2">
					<Avatar class="h-8 w-8 bg-slate-500">
						<AvatarFallback>CN</AvatarFallback>
					</Avatar>
					<div class="flex flex-1 flex-wrap items-center justify-between">
						<span class="text-sm font-medium">
							{{
								`${postDetails?.author?.firstName} ${postDetails?.author?.lastName}`
							}}
						</span>
						<span class="text-sm text-muted-foreground">
							{{ dayjs(postDetails?.publishedAt).format('MMMM D, YYYY') }}
						</span>
					</div>
				</div>
			</div>

			<div class="grid grid-cols-1 gap-y-4 lg:grid-cols-4 lg:gap-x-6">
				<div class="max-w-3xl space-y-8 lg:col-span-3">
					<NuxtImg
						v-if="postDetails?.coverImage"
						:src="postDetails.coverImage"
						class="w-full rounded-sm object-cover"
					/>

					<div class="blog-prose" v-html="postHtmlContent"></div>

					<ul class="space-y-2">
						<Badge
							v-for="tag in postDetails?.tags ?? []"
							:key="tag.id"
							class="mr-2 transition-all hover:translate-y-[-2px]"
							as-child
						>
							<NuxtLink :to="`tags/${tag.slug}`">
								{{ tag.name }}
							</NuxtLink>
						</Badge>
						<Badge
							v-for="tag in postDetails?.tags ?? []"
							:key="tag.id"
							class="mr-2 transition-all hover:translate-y-[-2px]"
							as-child
						>
							<NuxtLink :to="`tags/${tag.slug}`">
								{{ tag.name }}
							</NuxtLink>
						</Badge>
						<Badge
							v-for="tag in postDetails?.tags ?? []"
							:key="tag.id"
							class="mr-2 transition-all hover:translate-y-[-2px]"
							as-child
						>
							<NuxtLink :to="`tags/${tag.slug}`">
								{{ tag.name }}
							</NuxtLink>
						</Badge>
						<Badge
							v-for="tag in postDetails?.tags ?? []"
							:key="tag.id"
							class="mr-2 transition-all hover:translate-y-[-2px]"
							as-child
						>
							<NuxtLink :to="`tags/${tag.slug}`">
								{{ tag.name }}
							</NuxtLink>
						</Badge>
					</ul>
				</div>
				<div class="order-first lg:order-none lg:col-span-1">
					<div class="sticky top-24 overflow-auto md:max-h-[calc(100vh-120px)]">
						<TableOfContent :items="tableOfContentItems" />
					</div>
				</div>
			</div>

			<div class="space-y-4">
				<div>Like & share section</div>
				<div>
					<Separator />
					<div class="my-4 flex flex-wrap items-center justify-between gap-2">
						<div class="flex items-center justify-start space-x-2">
							<h3 class="text-lg font-semibold">Comments(20)</h3>
						</div>
						<div class="flex items-center justify-end space-x-2">
							<Select model-value="newest">
								<SelectTrigger
									id="comment-sort"
									name="comment-sort"
									class="min-w-32"
								>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectContent>
										<SelectItem value="newest">Newest</SelectItem>
										<SelectItem value="oldest">Oldest</SelectItem>
										<SelectItem value="max-like">Max like</SelectItem>
									</SelectContent>
								</SelectContent>
							</Select>
							<Button variant="secondary">
								<RefreshCw />
								Refresh
							</Button>
							<Button @click="fnToggleShowCommentEditor">
								{{ showComentEditor ? 'Cancel' : 'Add Comment' }}
							</Button>
						</div>
					</div>
				</div>

				<CommentEditor
					v-show="showComentEditor"
					@new-comment="onNewComment"
					@cancel="fnToggleShowCommentEditor"
				/>

				<CommentList />
			</div>
		</article>
	</main>
</template>

<script setup lang="ts">
import { RefreshCw } from 'lucide-vue-next'
import { Separator } from '~/components/ui/separator'
import TableOfContent from '~/components/pages/client/toc/TableOfContent.vue'
import CommentEditor from '~/components/pages/client/comment/CommentEditor.vue'
import CommentList from '~/components/pages/client/comment/CommentList.vue'
import type { IComment } from '~/types'

definePageMeta({
	layout: 'client'
})

const dayjs = useDayjs()
const clientBlogStore = useClientBlogStore()
const {
	fetchPostDetail,
	fetchPostHtmlContent,
	fetchPostComments,
	onNewTopLevelComment
} = clientBlogStore
const {
	postDetails,
	postHtmlContent,
	tableOfContentItems,
	postComments,
	activeId
} = storeToRefs(clientBlogStore)

const showComentEditor = ref(false)

const { status: fetchPostDataStatus } = await useAsyncData(() =>
	fetchPostDetail()
)
const { status: fetchPostHtmlStatus } = await useAsyncData(() =>
	fetchPostHtmlContent()
)
const { status: fetchPostCommentsStatus } = await useAsyncData(() =>
	fetchPostComments()
)

const isLoading = computed(() => {
	return (
		fetchPostDataStatus.value === 'pending' ||
		fetchPostHtmlStatus.value === 'pending' ||
		fetchPostCommentsStatus.value === 'pending'
	)
})

const onNewComment = (newComment: IComment) => {
	onNewTopLevelComment(newComment)
}

const fnToggleShowCommentEditor = () => {
	showComentEditor.value = !showComentEditor.value
}
</script>

<style scoped></style>
