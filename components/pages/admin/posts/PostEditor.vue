<template>
	<Card>
		<ScrollArea class="h-full">
			<EditorContent class="h-full" :editor="tiptapEditor" />
			<template v-if="tiptapEditor">
				<TextBubbleMenu :editor="tiptapEditor" />
			</template>
		</ScrollArea>
	</Card>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import type { Editor } from '@tiptap/vue-3'
import * as Y from 'yjs'
import { HocuspocusProvider } from '@hocuspocus/provider'
import { ExtensionKit } from '~/libs/tiptap/extension-kit'
import TextBubbleMenu from '@/components/tiptap/TextBubbleMenu/TextBubbleMenu.vue'
import Card from '~/components/ui/card/Card.vue'
import ScrollArea from '~/components/ui/scroll-area/ScrollArea.vue'

// Data
const editor = useEditor({
	content: `
    <p>I’m running Tiptap with Vue.js. 🎉</p>
  `,
	extensions: [...ExtensionKit],
	editorProps: {
		attributes: {
			class: 'min-h-full'
		}
	}
})

// console.log('[TEST]', editor);

// const editor = useTiptapEditor({
//   ydoc,
//   provider,
// });
const wsConnection = new WebSocket('ws://127.0.0.1:8000/sync')
const ydoc = new Y.Doc()
const provider = new HocuspocusProvider({
	name: 'post_1',
	url: wsConnection.url,
	document: ydoc
})

const tiptapEditor = shallowRef<Editor | undefined>()

onMounted(async () => {
	await nextTick()
	const { editor } = useTiptapEditor({
		ydoc: ydoc,
		provider: provider
	})
	tiptapEditor.value = editor

	console.log('[MOUNTED]', editor)

	// initHocuspocusProvider();
})
</script>

<style scoped lang="scss"></style>
