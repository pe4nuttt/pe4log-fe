<template>
	<header
		class="fixed z-50 flex h-16 w-[inherit] items-center justify-between gap-3 rounded-md bg-background px-4 sm:gap-4"
		:class="{ shadow: offset > 0 && props.fixed }"
	>
		<div class="flex items-center gap-2">
			<SidebarTrigger class="scale-125" />
			<Separator orientation="vertical" class="h-6" />
			<AppBreadcrumb />
		</div>

		<div class="flex items-center gap-2">
			<Search class="h-9" />
			<ThemeSwitcher />
		</div>
	</header>
</template>

<script setup lang="ts">
import Separator from '~/components/ui/separator/Separator.vue'
import SidebarTrigger from '~/components/ui/sidebar/SidebarTrigger.vue'
import AppBreadcrumb from './AppBreadcrumb.vue'
import Search from '~/components/global/Search.vue'
import ThemeSwitcher from '~/components/global/ThemeSwitcher.vue'

interface IProps {
	fixed?: boolean
}

const props = withDefaults(defineProps<IProps>(), {
	fixed: true
})

const offset = ref(0)

const onScroll = () => {
	offset.value = document.body.scrollTop || document.documentElement.scrollTop
}

onMounted(() => {
	window.addEventListener('scroll', onScroll)
})

onUnmounted(() => {
	window.removeEventListener('scroll', onScroll)
})
</script>

<style scoped></style>
