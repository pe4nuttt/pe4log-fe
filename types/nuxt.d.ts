import type _ from 'lodash'

declare module '#app' {
	interface NuxtApp {
		$_: typeof _
	}
}

declare module 'vue' {
	interface ComponentCustomProperties {
		$_: typeof _
	}
}
