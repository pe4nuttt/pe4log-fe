import type { RouterConfig } from '@nuxt/schema'

export default {
	scrollBehavior(to, from, savedPosition) {
		if (from && Object.keys(to.query).length) {
			if (to.fullPath.split('?')[0] == from.fullPath.split('?')[0]) return
		}
		if (savedPosition) {
			return savedPosition
		} else if (to.hash) {
			if (!to.path.startsWith('/blog/')) {
				return { el: to.hash }
			}
			return
		} else {
			return { top: 0 }
		}
	}
} satisfies RouterConfig
