<template>
	<CardHeader class="grid grid-cols-3 gap-2">
		<Button size="sm" class="rounded-sm" @click="() => {}">
			<Icon name="ion:logo-google" color="black" size="18px" />
		</Button>
		<Button size="sm" class="rounded-sm">
			<Icon name="ion:logo-github" color="black" size="18px" />
		</Button>
		<Button size="sm" class="rounded-sm">
			<Icon name="ion:logo-facebook" color="black" size="18px" />
		</Button>
	</CardHeader>
</template>

<script setup lang="ts">
import { CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
</script>

<style scoped></style>
