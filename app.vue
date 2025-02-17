<template>
	<div>
		<Button>Test</Button>
		<Button variant="secondary">Secondary</Button>
		<NuxtRouteAnnouncer />
		<NuxtWelcome />
	</div>
</template>

<script setup>
import './assets/styles/index.scss'
import { Button } from '@/components/ui/button'
</script>
