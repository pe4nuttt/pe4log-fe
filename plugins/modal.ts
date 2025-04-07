import { render } from 'vue'
import VxDialog, { type VxDialogProps } from '~/components/global/VxDialog.vue'

type VxDialogOptions = Omit<VxDialogProps, 'modelValue'>

export default defineNuxtPlugin((nuxtApp) => {
	let container: HTMLDivElement | null = null

	const createContainer = () => {
		if (!container) {
			container = document.createElement('div')
			document.body.appendChild(container)
		}
	}

	const createDialog = (props: any) => {
		createContainer()

		// Clear previous dialog
		render(null, container!)

		const vnode: VNode = h(VxDialog, {
			...props,
			onClose: () => {
				render(null, container!)
			}
		})

		vnode.appContext = nuxtApp.vueApp._context
		render(vnode, container!)
	}

	const vxAlert = (message: string, options: VxDialogOptions = {}) => {
		const settings: VxDialogOptions = {
			title: 'Alert',
			resolveText: 'OK',
			resolve: () => {},
			...options
		}

		createDialog({
			type: 'alert',
			title: settings.title,
			message,
			resolveText: settings.resolveText,
			resolve: settings.resolve,
			modelValue: true
		})
	}

	const vxConfirm = (message: string, options: VxDialogOptions = {}) => {
		const settings: VxDialogOptions = {
			title: 'Confirm',
			resolveText: 'OK',
			rejectText: 'Cancel',
			resolve: () => {},
			reject: () => {},
			...options
		}

		createDialog({
			type: 'confirm',
			title: settings.title,
			message,
			resolveText: settings.resolveText,
			rejectText: settings.rejectText,
			resolve: settings.resolve,
			reject: settings.reject,
			modelValue: true
		})
	}

	return {
		provide: {
			vxConfirm: vxConfirm,
			vxAlert: vxAlert
		}
	}
})
