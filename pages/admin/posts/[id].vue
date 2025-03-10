<template>
	<div class="flex h-full flex-col space-y-4">
		<div class="flex flex-wrap items-center justify-between gap-x-4">
			<div>
				<h2 class="text-3xl font-bold tracking-tight">
					{{ post?.title ?? 'Untitled' }}
				</h2>
				<p class="text-sm text-muted-foreground">
					{{
						post?.createdAt
							? dayjs(post.createdAt).format('YYYY-MM-DD HH:mm:ss')
							: ''
					}}
				</p>
			</div>
			<div class="flex gap-2">
				<Button>
					<Settings />
					Settings
					<Plus />
				</Button>
			</div>
		</div>

		<ClientOnly>
			<PostEditor class="flex-1 overflow-hidden" />
		</ClientOnly>
	</div>
</template>

<script setup lang="ts">
import PostEditor from '~/components/pages/admin/posts/PostEditor.vue'
import { Settings } from 'lucide-vue-next'
import ScrollArea from '~/components/ui/scroll-area/ScrollArea.vue'

definePageMeta({
	layout: 'admin',
	middleware: ['auth']
})

const dayjs = useDayjs()
const route = useRoute()
const postId = route.params.id

const postStore = usePostStore()
const { post } = storeToRefs(postStore)
const { getPostDetails } = postStore

const { refresh: refreshPost } = await useAsyncData(
	'postDetail',
	async () => {
		return getPostDetails(+postId)
			.then(() => true)
			.catch((error) => {
				showError({
					status: 400,
					statusMessage: error
				})
			})
	},
	{
		// server: false,
		lazy: true
	}
)
</script>

<style scoped></style>
