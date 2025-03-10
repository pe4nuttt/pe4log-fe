<template>
	<header
		class="fixed z-50 flex h-16 w-[inherit] items-center justify-between gap-3 bg-background px-4 sm:gap-4"
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
import { cn } from '@/libs/utils'
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
</script>

<style scoped></style>
