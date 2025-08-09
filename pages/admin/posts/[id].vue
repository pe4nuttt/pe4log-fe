<template>
	<div
		class="relative mb-4 mr-[-0.75rem] flex h-full flex-col space-y-4 overflow-y-auto pb-[2px] pr-3"
	>
		<LoadingOverlay v-if="isLoading" />
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
				<Button disabled class="bg-muted text-muted-foreground">
					{{ isEditorSaved ? 'Saved' : 'Saving...' }}
				</Button>

				<Button @click="openFormDialog = true">
					<Settings />
					Settings
				</Button>
			</div>
		</div>

		<ClientOnly>
			<PostEditor v-model:is-editor-saved="isEditorSaved" class="mx-[1px]" />
		</ClientOnly>

		<PostFormDialog v-model:open="openFormDialog" @updated="refreshPost" />
	</div>
</template>

<script setup lang="ts">
import PostEditor from '~/components/pages/admin/posts/PostEditor.vue'
import { Settings } from 'lucide-vue-next'
import PostFormDialog from '~/components/pages/admin/posts/PostFormDialog.vue'

definePageMeta({
	// layout: 'admin',
	middleware: ['auth']
})

const dayjs = useDayjs()
const route = useRoute()
const router = useRouter()
const postId = route.params.id
const showSetting = route.query.showSetting

const postStore = usePostStore()
const { post } = storeToRefs(postStore)
const { getPostDetails } = postStore

const openFormDialog = ref(false)
const isEditorSaved = ref(true)

const { refresh: refreshPost, status } = await useAsyncData(
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
		lazy: true
	}
)

const isLoading = computed(() => status.value === 'pending')

onMounted(() => {
	if (showSetting) {
		openFormDialog.value = true
		router.replace({
			query: {}
		})
	}
})
</script>

<style scoped></style>
