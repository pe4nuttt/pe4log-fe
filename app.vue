<template>
	<!-- <div>
		<Button>Test</Button>
		<Button variant="secondary">Secondary</Button>
		<NuxtRouteAnnouncer />
		<NuxtWelcome />
	</div> -->
	<NuxtLoadingIndicator />
	<div class="app">
		<NuxtLayout>
			<NuxtPage />
			<Toaster />
		</NuxtLayout>
	</div>
</template>

<script setup>
import './assets/styles/index.scss'
import { Button } from '@/components/ui/button'
import { Toaster } from './components/ui/toast/'
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'

ModuleRegistry.registerModules([AllCommunityModule])
</script>
