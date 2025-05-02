<template>
	<main>
		<article class="space-y-6">
			<div class="w-full max-w-2xl space-y-4">
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

			<div
				class="grid grid-cols-1 gap-y-4 md:grid-cols-3 md:gap-x-4 lg:grid-cols-4 lg:gap-x-6"
			>
				<div class="max-w-2xl space-y-8 md:col-span-2 lg:col-span-3">
					<div class="blog-prose" v-html="postHtmlContent"></div>
				</div>
				<div class="order-first md:order-none">
					<div class="sticky top-24 overflow-auto md:max-h-[calc(100vh-120px)]">
						<TableOfContent :items="tableOfContentItems" />
					</div>
				</div>
			</div>
		</article>
	</main>
</template>

<script setup lang="ts">
import TableOfContent from '~/components/pages/client/toc/TableOfContent.vue'
import type { IPost } from '~/types'

definePageMeta({
	layout: 'client'
})

const dayjs = useDayjs()
const clientBlogStore = useClientBlogStore()
const { fetchPostDetail, fetchPostHtmlContent } = clientBlogStore
const { postDetails, postHtmlContent, tableOfContentItems, activeId } =
	storeToRefs(clientBlogStore)

watch(activeId, (val) => {
	console.log('activeId', val)
})

const { status: fetchPostDataStatus } = await useAsyncData(() =>
	fetchPostDetail()
)
const { status: fetchPostHtmlStatus } = await useAsyncData(() =>
	fetchPostHtmlContent()
)

const isLoading = computed(() => {
	return (
		fetchPostDataStatus.value === 'pending' ||
		fetchPostHtmlStatus.value === 'pending'
	)
})
</script>

<style scoped></style>
