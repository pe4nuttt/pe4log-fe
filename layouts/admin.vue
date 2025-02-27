<template>
	<SidebarProvider>
		<AppSidebar class="peer" />
		<div
			id="content"
			class="h-svh peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)] peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]"
		>
			<AppHeader />
			<!-- <SidebarTrigger /> -->
			<main class="mt-16">User: {{ user }}</main>
			<slot />
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

<style scoped></style>
