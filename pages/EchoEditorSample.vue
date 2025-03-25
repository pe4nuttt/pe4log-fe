<script setup lang="ts">
import { Editor, useEditor } from '@tiptap/vue-3'
import type { Doc, Doc as YDoc } from 'yjs'
import { ExtensionKit } from '~/libs/tiptap/extension-kit'
import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCursor from '@tiptap/extension-collaboration-cursor'
import {
	Bold,
	BulletList,
	Italic,
	BaseKit,
	locale,
	Underline,
	Strike,
	LineHeight,
	Image,
	History,
	Heading,
	CodeBlock,
	FontSize,
	Highlight,
	Table,
	Clear,
	Blockquote,
	Link,
	Color,
	Video,
	OrderedList,
	HorizontalRule,
	Fullscreen,
	TaskList,
	MoreMark,
	FormatPainter,
	SlashCommand,
	Indent,
	ImportWord,
	Columns,
	TextAlign,
	ImageUpload,
	VideoUpload,
	FontFamily,
	FindAndReplace,
	Code,
	AI,
	Preview,
	EchoEditor,
	Printer,
	Iframe
} from 'echo-editor'
import * as Y from 'yjs'
import { HocuspocusProvider } from '@hocuspocus/provider'

const wsConnection = new WebSocket('ws://127.0.0.1:8000/sync')
const ydoc = new Y.Doc()
const provider = new HocuspocusProvider({
	name: `post_1`,
	url: wsConnection.url,
	document: ydoc
})

const content = ref('')
const extensions = [
	// BaseKit.configure({
	// 	placeholder: {
	// 		placeholder: 'Start writing...'
	// 	}
	// }),
	BaseKit.configure({
		characterCount: {
			limit: 50000
		}
	}),
	History,
	Columns,
	FormatPainter,
	Clear,
	Heading.configure({ spacer: true }),
	FontSize,
	FontFamily,
	Bold,
	Italic,
	Underline,
	Strike,
	MoreMark,
	Color.configure({ spacer: true }),
	Highlight,
	BulletList,
	OrderedList,
	TextAlign.configure({
		types: ['heading', 'paragraph', 'image'],
		spacer: true
	}),
	Indent,
	LineHeight,
	TaskList.configure({
		spacer: true,
		taskItem: {
			nested: true
		}
	}),
	Link,
	Image,
	ImageUpload.configure({
		upload: (files: File) => {
			return new Promise((resolve) => {
				setTimeout(() => {
					resolve(URL.createObjectURL(files))
				}, 3000)
			})
		}
	}),
	Video,
	VideoUpload.configure({
		upload: handleFileUpload
	}),
	Blockquote,
	SlashCommand,
	HorizontalRule,
	Fullscreen.configure({ spacer: true }),
	CodeBlock,
	Table,
	Code,
	// AI.configure({
	// 	completions: AICompletions,
	// 	shortcuts: [
	// 		// 这里可以传入额外的自定义shortcuts
	// 		{
	// 			label: 'Custom Actions',
	// 			children: [
	// 				{
	// 					label: 'This is Custom Action',
	// 					prompt:
	// 						'Rewrite this content with no spelling mistakes, proper grammar, and with more descriptive language, using best writing practices without losing the original meaning.'
	// 				}
	// 			]
	// 		}
	// 	]
	// }),
	ImportWord.configure({
		upload: handleFileUpload
	}),
	FindAndReplace.configure({ spacer: true }),
	Printer,
	Preview,
	Iframe,
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

async function handleFileUpload(files: File[]) {
	const f = files.map((file) => ({
		src: URL.createObjectURL(file),
		alt: file.name
	}))
	return Promise.resolve(f)
}

/**
 * AI Completions handler function
 * WARNING: This is just a demo implementation. In production:
 * - DO NOT expose API keys in the frontend
 * - DO implement this through your backend API
 * - DO add proper error handling and rate limiting
 *
 * @param history - Chat history array containing messages with role and content
 * @param signal - AbortSignal for cancelling requests
 * @returns OpenAI chat completion stream
 */
// async function AICompletions(
// 	history: Array<{ role: string; content: string }> = [],
// 	signal?: AbortSignal
// ) {
// 	// groq.com For free llm api recommend deepseek r1 70b
// 	// SECURITY WARNING: API keys should never be exposed in the frontend
// 	// This is just for demo purposes
// 	// In production, implement this through your backend API
// 	const apiKey = import.meta.env.VITE_OPENAI_API_KEY
// 	const baseURL = import.meta.env.VITE_OPENAI_BASE_URL
// 	const model = import.meta.env.VITE_OPENAI_MODEL

// 	if (!apiKey || !baseURL || !model) {
// 		throw new Error(
// 			'OpenAI configuration is missing. Please check your environment variables.'
// 		)
// 	}

// 	const openai = new OpenAI({
// 		apiKey: apiKey,
// 		dangerouslyAllowBrowser: true,
// 		baseURL: baseURL
// 	})

// 	const systemMsg = `You are a professional writing assistant. Please respond based on the user's context:

// 1. Maintain a professional, accurate, and objective tone
// 2. Ensure responses are clear, coherent, and well-structured
// 3. Responses must be in HTML format, preserving all HTML tags, links, and styles
// 4. Support the following writing enhancements:
//    - Grammar and spelling corrections
//    - Improved sentence structure and expression
//    - Optimized article formatting and layout
//    - Maintain the core meaning of the original text
// 5. If context includes code, maintain code formatting and provide optimization suggestions
// 6. Add appropriate HTML elements like headings, lists, quotes etc. to enhance readability as needed

// Please respond only based on the provided context, do not add irrelevant information.`

// 	const systemPrompt = [{ role: 'system', content: systemMsg }]
// 	const finalMessages = [...systemPrompt]

// 	if (history.length > 0) {
// 		finalMessages.push(...history)
// 	}

// 	try {
// 		const stream = await openai.chat.completions.create(
// 			{
// 				model,
// 				messages: finalMessages,
// 				temperature: 0.7,
// 				stream: true,
// 				reasoning_format: 'parsed' // groq deepseek r1 need this
// 			} as any,
// 			{ signal }
// 		)

// 		return stream
// 	} catch (error) {
// 		if (error instanceof Error) {
// 			console.error('Error in AI Completions:', error.message)
// 		}
// 		throw error
// 	}
// }

onMounted(() => {
	locale.setLang('en')
})
</script>

<template>
	<echo-editor
		v-model="content"
		:extensions="extensions"
		:hide-toolbar="false"
		:hide-menubar="true"
		lang="en"
	/>
</template>
