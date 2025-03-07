<template>
	<SidebarProvider id="admin-app">
		<AppSidebar class="peer" />
		<div
			id="content"
			class="h-svh w-full peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)] peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]"
		>
			<AppHeader />
			<!-- <SidebarTrigger /> -->
			<main class="mt-16 h-[calc(100vh-4rem)] px-4 pb-2 pt-6">
				<slot />
			</main>
		</div>
	</SidebarProvider>
</template>

<script setup lang="ts">
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import AppHeader from '~/components/layout/admin/AppHeader.vue'
import AppSidebar from '~/components/layout/admin/AppSidebar.vue'

const userStore = useUserStore()

const { user } = storeToRefs(userStore)
</script>

<style lang="scss">
#admin-app {
	font-family:
		'Inter',
		system-ui,
		-apple-system,
		BlinkMacSystemFont,
		'Segoe UI',
		Roboto,
		Oxygen,
		Ubuntu,
		Cantarell,
		'Open Sans',
		'Helvetica Neue',
		sans-serif;
}
</style>
