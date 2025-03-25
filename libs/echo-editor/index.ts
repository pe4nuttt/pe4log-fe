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

export const EchoEditorExtensionKit = [
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
	// ImageUpload.configure({
	// 	upload: (files: File) => {
	// 		return new Promise((resolve) => {
	// 			setTimeout(() => {
	// 				resolve(URL.createObjectURL(files))
	// 			}, 3000)
	// 		})
	// 	}
	// }),
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
	Iframe
	// Collaboration.configure({
	// 	document: ydoc
	// })
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
