import { HocuspocusProvider } from '@hocuspocus/provider'

import {
	StarterKit,
	Highlight,
	CharacterCount,
	Underline,
	Placeholder,
	TextAlign,
	TextStyle,
	FontFamily,
	Typography,
	Color,
	Focus,
	Dropcursor,
	// CollaborationCursor,
	// Subscript,
	// Superscript,
	// Paragraph,
	CodeBlock,
	BulletList,
	OrderedList,
	// Collaboration,
	// TaskItem,
	// TaskList,
	Document,
	Heading,
	HorizontalRule,
	BlockquoteFigure,
	Columns,
	Column,
	TaskList,
	TaskItem,
	FontSize,
	TrailingNode,
	Link,
	Subscript,
	Superscript,
	Selection,
	Figcaption
} from './index'
import { all, createLowlight } from 'lowlight'
import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight'

const lowlight = createLowlight(all)

export const ExtensionKit = [
	Document,
	Columns,
	OrderedList,
	BulletList,
	TaskList,
	TaskItem.configure({
		nested: true
	}),
	Column,
	Selection,
	Heading.configure({
		levels: [1, 2, 3, 4, 5, 6]
	}),
	HorizontalRule,
	StarterKit.configure({
		document: false,
		dropcursor: false,
		heading: false,
		horizontalRule: false,
		blockquote: false,
		// history: false,
		codeBlock: false
	}),
	CodeBlockLowlight.configure({
		lowlight,
		defaultLanguage: null
	}),
	TextStyle,
	FontSize,
	FontFamily,
	Color,
	TrailingNode,
	Link.configure({
		openOnClick: false
	}),
	Highlight.configure({ multicolor: true }),
	Underline,
	CharacterCount.configure({ limit: 50000 }),
	// TableOfContents,
	// TableOfContentsNode,
	// ImageUpload.configure({
	//   clientId: provider?.document?.clientID,
	// }),
	// ImageBlock,
	TextAlign.extend({
		addKeyboardShortcuts() {
			return {}
		}
	}).configure({
		types: ['heading', 'paragraph']
	}),
	Subscript,
	Superscript,
	// Table,
	// TableCell,
	// TableHeader,
	// TableRow,
	Typography,
	Placeholder.configure({
		includeChildren: true,
		showOnlyCurrent: false,
		placeholder: () => ''
	}),
	// SlashCommand,
	Focus,
	Figcaption,
	BlockquoteFigure,
	Dropcursor.configure({
		width: 2,
		class: 'ProseMirror-dropcursor border-black'
	})
]
