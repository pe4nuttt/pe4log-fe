<template>
	<div class="rounded-lg border p-4">
		<Tabs v-model="currentTab" class="mb-2 w-full">
			<TabsList class="w-full">
				<TabsTrigger class="w-full" value="write">
					<div class="flex items-center gap-2">
						<PenLine class="inline-block h-5 w-5" />
						Write
					</div>
				</TabsTrigger>
				<TabsTrigger class="w-full" value="preview">
					<div class="flex items-center gap-2">
						<Eye class="inline-block h-5 w-5" />
						Preview
					</div>
				</TabsTrigger>
			</TabsList>
		</Tabs>

		<div class="flex gap-2">
			<div class="flex h-6 w-6 items-center justify-center sm:h-8 sm:w-8">
				<Avatar class="h-full w-full">
					<AvatarImage
						:src="
							img(
								user?.profilePicture ?? '',
								{},
								{
									provider: 'cloudinary'
								}
							)
						"
						:alt="getNameShorthand(`${user?.firstName} ${user?.lastName}`)"
					/>
					<AvatarFallback>
						{{ getNameShorthand(`${user?.firstName} ${user?.lastName}`) }}
					</AvatarFallback>
				</Avatar>
			</div>

			<template v-if="editor">
				<div v-show="currentTab === 'write'" class="flex-1 rounded-md border">
					<Toolbar class="z-10 border-none last:pr-2">
						<ToolbarButton
							v-tooltip="{
								content: '<p>Bold</p><p class=\'text-gray-400\'>Ctrl + B</p>',
								html: true
							}"
							:active="editor.isActive('bold')"
							@click="editor.chain().focus().toggleBold().run()"
						>
							<Icon name="lucide:bold" size="15px" class="h-[15px] w-[15px]" />
						</ToolbarButton>
						<ToolbarButton
							v-tooltip="{
								content: `<p>Italic</p><p class=\'text-gray-400\'>Ctrl + I</p>`,
								html: true
							}"
							:active="editor.isActive('italic')"
							@click="editor.chain().focus().toggleItalic().run()"
						>
							<Icon
								name="lucide:italic"
								size="15px"
								class="h-[15px] w-[15px]"
							/>
						</ToolbarButton>
						<ToolbarButton
							v-tooltip="{
								content:
									'<p>Underline</p><p class=\'text-gray-400\'>Ctrl + U</p>',
								html: true
							}"
							:active="editor.isActive('underline')"
							@click="editor.chain().focus().toggleUnderline().run()"
						>
							<Icon
								name="lucide:underline"
								size="15px"
								class="h-[15px] w-[15px]"
							/>
						</ToolbarButton>
						<ToolbarButton
							v-tooltip="{
								content:
									'<p>Strike-through</p><p class=\'text-gray-400\'>Ctrl + Shift + S</p>',
								html: true
							}"
							:active="editor.isActive('strike')"
							@click="editor.chain().focus().toggleStrike().run()"
						>
							<Icon
								name="lucide:strikethrough"
								size="15px"
								class="h-[15px] w-[15px]"
							/>
						</ToolbarButton>
						<ToolbarButton
							v-tooltip="{
								content: '<p>Code</p><p class=\'text-gray-400\'>Ctrl + E</p>',
								html: true
							}"
							:active="editor.isActive('code')"
							@click="editor.chain().focus().toggleCode().run()"
						>
							<Icon name="lucide:code" size="15px" class="h-[15px] w-[15px]" />
						</ToolbarButton>
						<ToolbarButton
							v-tooltip="{
								content:
									'<p>Code block</p><p class=\'text-gray-400\'>Ctrl + Alt + C</p>',
								html: true
							}"
							:active="editor.isActive('codeBlock')"
							@click="editor.chain().focus().toggleCodeBlock().run()"
						>
							<Icon
								name="lucide:code-xml"
								size="15px"
								class="h-[15px] w-[15px]"
							/>
						</ToolbarButton>
					</Toolbar>
					<editor-content :editor="editor" />
				</div>
				<div
					v-show="currentTab === 'preview'"
					class="class tiptap ProseMirror min-h-[80px] w-full rounded-md border !px-3"
				>
					<p
						v-if="!isHtmlContentEmpty(editor.getHTML())"
						v-dompurify-html="editor.getHTML()"
					/>
					<p v-else class="italic">Nothing to preview</p>
				</div>
			</template>
		</div>

		<div class="flex justify-end gap-2 px-1 py-2">
			<Button size="sm" variant="outline" @click="() => emits('cancel')">
				Cancel
			</Button>
			<Button :disabled="disabledSubmit" size="sm" @click="onSumbit">
				Comment
			</Button>
		</div>
	</div>
</template>

<script setup lang="ts">
import Highlight from '@tiptap/extension-highlight'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import StarterKit from '@tiptap/starter-kit'
import { Editor, EditorContent, type Extensions } from '@tiptap/vue-3'
import { Eye, PenLine } from 'lucide-vue-next'
import { ToolbarButton } from '~/components/ui/toolbar'
import type { IComment } from '~/types'

interface IProps {
	parentId?: number | null
}

const props = withDefaults(defineProps<IProps>(), {
	parentId: null
})

const emits = defineEmits<{
	submit: [content: string]
	cancel: []
	newComment: [comment: IComment]
}>()

const { $api } = useNuxtApp()
const { toastSuccess, toastError } = useAppToast()
const route = useRoute()
const img = useImage()
const userStore = useUserStore()

const slug = route.params.slug as string
const { user } = storeToRefs(userStore)
const editor = ref<Editor | undefined>(undefined)
const isSubmitting = ref(false)
const currentTab = ref('write')

const disabledSubmit = computed(() => {
	return (
		!editor.value ||
		editor.value.isEmpty ||
		isHtmlContentEmpty(editor.value.getHTML())
	)
})

const onSumbit = async () => {
	if (!editor.value) return
	const content = editor.value.getHTML()

	console.log('Submitting comment:', content)

	try {
		isSubmitting.value = true
		const response = await $api.comments.addComment({
			postSlug: slug,
			content,
			parentId: props.parentId
		})
		toastSuccess('Comment added successfully')
		emits('newComment', response.data)
		editor.value.commands.clearContent()
	} catch (error) {
		toastError(error)
	} finally {
		isSubmitting.value = false
	}
}

onMounted(() => {
	editor.value = new Editor({
		extensions: [
			StarterKit,
			TextAlign.configure({
				types: ['heading', 'paragraph']
			}),
			Highlight,
			Placeholder.configure({
				placeholder: 'Add comment...'
			})
		] as Extensions
		// content: null
	})
})

onBeforeUnmount(() => {
	if (editor.value) {
		editor.value.destroy()
	}
})
</script>

<style scoped lang="scss">
:deep(.tiptap) {
	padding: 4px 16px;
	height: 80px;
	overflow-y: auto;
	resize: vertical;

	&.ProseMirror > * {
		max-width: 100%;
	}

	p.is-editor-empty:first-child::before {
		color: var(--gray-4);
		content: attr(data-placeholder);
		float: left;
		height: 0;
		pointer-events: none;
	}
}
</style>
