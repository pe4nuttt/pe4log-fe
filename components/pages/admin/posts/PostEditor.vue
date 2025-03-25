<template>
	<echo-editor
		:extensions="extensions"
		:hide-toolbar="false"
		:hide-menubar="true"
		max-height="700px"
		min-height="500px"
		:dark="$colorMode.value === 'dark'"
	/>
</template>

<script setup lang="ts">
import { EchoEditor, ImageUpload, locale } from 'echo-editor'
import * as Y from 'yjs'
import { HocuspocusProvider } from '@hocuspocus/provider'
import { EchoEditorExtensionKit } from '~/libs/echo-editor'
import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCursor from '@tiptap/extension-collaboration-cursor'
import { useVModel } from '@vueuse/core'
import { EHocuspocusEvents } from '~/types/tiptap'

type TProps = {
	isEditorSaved?: boolean
}

const props = withDefaults(defineProps<TProps>(), {
	isEditorSaved: true
})

const emits = defineEmits<{
	'update:isEditorSaved': [isEditorSaved: boolean]
}>()

// Data
const route = useRoute()
const { $api } = useNuxtApp()
const isEditorSaved = useVModel(props, 'isEditorSaved', emits) as Ref<boolean>

const postId = route.params.id
const wsConnection = new WebSocket('ws://127.0.0.1:8000/sync')
const ydoc = new Y.Doc()
const provider = new HocuspocusProvider({
	name: `post_${postId}`,
	url: wsConnection.url,
	document: ydoc
})

const extensions = [
	...EchoEditorExtensionKit,
	ImageUpload.configure({
		upload: async (file: File) => {
			try {
				console.log('[CHECK]', file)
				const response = await $api.files.uploadBlogImage({
					file
				})
				return response.data.url
			} catch (error) {
				console.error(error)
				return URL.createObjectURL(file)
			}
		}
	}),
	Collaboration.configure({
		document: ydoc
	})
	// CollaborationCursor.configure({
	// 	provider: provider,
	// 	user: {
	// 		name: 'Tien Anh',
	// 		color: '#f783ac'
	// 	}
	// })
]

provider.on('outgoingMessage', (message: any) => {
	// console.log('[OUTGOING]', message)
})

provider.on('message', (message: any) => {
	console.log('[MESSAGE]', message)
})

provider.on('synced', (data: any) => {
	console.log('[SYNCED]', data)
	// isEditorSaved.value = true
})

provider.on('stateless', (stateless: EHocuspocusEvents) => {
	console.log('[STATELESS]', stateless)
	switch (stateless) {
		case EHocuspocusEvents.DOCUMENT_SAVED:
			isEditorSaved.value = false
			break
		case EHocuspocusEvents.DOCUMENT_SAVING:
			isEditorSaved.value = false
			break
		default:
			break
	}
})

onMounted(() => {
	locale.setLang('en')
})
</script>

<style scoped></style>
