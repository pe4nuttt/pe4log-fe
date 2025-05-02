import { useDebounceFn } from '@vueuse/core'

export function useActiveHeading(selector: string = 'h1, h2, h3') {
	const route = useRoute()
	const activeId = ref<string | null>(null)

	const onChangeActiveId = (newActiveId: string | null) => {
		activeId.value = newActiveId
	}

	function onScroll() {
		const scrollPosition = window.scrollY
		const offset = 80 + 20

		const headings = Array.from(
			document.querySelectorAll<HTMLElement>(selector)
		)

		let currentActiveId: string | null = headings[0]?.id || null

		// setTimeout(() => {
		headings.forEach((heading) => {
			const top = heading.offsetTop - offset
			if (top <= scrollPosition) {
				currentActiveId = heading.id
			}
		})

		onChangeActiveId(currentActiveId)
		// }, 500)
	}

	watch(
		() => route.hash,
		() => {
			if (route.hash) {
				activeId.value = route.hash.replace('#', '')
			}
		},
		{
			immediate: true
		}
	)

	onMounted(() => {
		document.addEventListener('scroll', onScroll)

		onScroll()
	})

	onUnmounted(() => {
		document.removeEventListener('scroll', onScroll)
	})

	return { activeId }
}
