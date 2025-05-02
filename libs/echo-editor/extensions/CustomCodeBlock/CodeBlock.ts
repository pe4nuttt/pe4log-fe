/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import {
	Extension,
	mergeAttributes,
	Node,
	textblockTypeInputRule
} from '@tiptap/core'
import { Editor, VueNodeViewRenderer } from '@tiptap/vue-3'

/**
 * Represents the props for the ButtonView component.
 */
export interface ButtonViewReturnComponentProps {
	/** Method triggered when action is performed */
	action?: (value?: any) => void
	/** Whether it is in the active state */
	isActive?: () => boolean
	/** Button icon */
	icon?: string
	/** Text displayed on hover */
	tooltip?: string
	[x: string]: any
}

/**
 * Represents the slots for the ButtonView component.
 */
export interface ButtonViewReturnComponentSlots {
	/** Dialog slot */
	dialog: () => any
	[x: string]: () => any
}

/**
 * Represents the return value for the ButtonView component.
 */
export interface ButtonViewReturn {
	/** Component */
	component: unknown
	/** Component props */
	componentProps: ButtonViewReturnComponentProps
	/** Component slots */
	componentSlots?: ButtonViewReturnComponentSlots
}

export interface ButtonViewParams<T = any> {
	/** Editor object */
	editor: Editor
	/** Extension object */
	extension: Extension<T>
	/** Translation function */
	t: (path: string) => string
}

export interface ButtonView<T = any> {
	(options: ButtonViewParams<T>): ButtonViewReturn | ButtonViewReturn[]
}

interface GeneralOptions<T> {
	/** Enabled divider */
	divider: boolean
	/** Enabled spacer */
	spacer: boolean
	/** Button view function */
	button: ButtonView<T>
	/** Show on Toolbar */
	toolbar?: boolean
}

import NodeView from './components/NodeView.vue'

interface CodeBlockOptions extends GeneralOptions<CodeBlockOptions> {}

declare module '@tiptap/core' {
	interface Commands<ReturnType> {
		setCodeBlock: {
			setCodeBlock: (options?: any) => ReturnType
		}
	}
}

/**
 * Matches a code block with backticks.
 */
export const backtickInputRegex = /^```([a-z]+)?[\s\n]$/

/**
 * Matches a code block with tildes.
 */
export const tildeInputRegex = /^~~~([a-z]+)?[\s\n]$/

export const CodeBlock = Node.create({
	name: 'codeBlock',
	group: 'block',
	atom: true,
	content: 'text*',
	addAttributes() {
		return {
			vnode: {
				default: true
			},
			code: {
				default: '',
				parseHTML: (element) => {
					return element.textContent || ''
				}
			},
			language: {
				default: 'plaintext'
			},
			lineNumbers: {
				default: true
			},
			wordWrap: {
				default: false
			},
			tabSize: {
				default: 2
			},
			shouldFocus: {
				default: true,
				parseHTML: () => false,
				renderHTML: false
			}
		}
	},
	parseHTML() {
		return [
			{
				tag: 'pre',
				preserveWhitespace: 'full',
				getAttrs: (node: HTMLElement) => {
					return {
						code: node.textContent || ''
					}
				}
			},
			{
				tag: 'pre code',
				preserveWhitespace: 'full',
				getAttrs: (node: HTMLElement) => {
					return {
						code: node.textContent || ''
					}
				}
			}
		]
	},
	renderHTML({ HTMLAttributes, node }) {
		const code = node.attrs.code || node.content.firstChild?.text || ''
		return [
			'pre',
			mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
			['code', {}, code]
		]
	},
	addNodeView() {
		return VueNodeViewRenderer(NodeView)
	},
	addCommands() {
		return {
			setCodeBlock:
				(options) =>
				({ commands }) => {
					return commands.insertContent({
						type: this.name,
						attrs: {
							...options,
							shouldFocus: true
						}
					})
				}
		}
	},
	addKeyboardShortcuts() {
		return {
			'Mod-Alt-c': () => this.editor.commands.setCodeBlock({})
		}
	},
	addInputRules() {
		return [
			textblockTypeInputRule({
				find: backtickInputRegex,
				type: this.type,
				getAttributes: (match) => ({
					language: match[1]
				})
			}),
			textblockTypeInputRule({
				find: tildeInputRegex,
				type: this.type,
				getAttributes: (match) => ({
					language: match[1]
				})
			})
		]
	}
})
