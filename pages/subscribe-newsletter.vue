<template>
	<div class="flex flex-col items-center gap-2">
		<template v-if="subscribeSuccess">
			<CircleCheckBig class="h-12 w-12 text-green-400" />
			<h3 class="text-3xl font-medium">Thanks for subscribing!</h3>
			<p class="">
				You'll now receive my latest posts and updates straight to your inbox.
			</p>
		</template>
		<template v-else>
			<CircleX class="h-12 w-12 text-destructive" />
			<h3 class="text-3xl font-medium">Oops!</h3>
			<p class="">Something went wrong. Please try again later!</p>
		</template>
	</div>
</template>

<script setup lang="ts">
import { CircleCheckBig, CircleX } from 'lucide-vue-next'

definePageMeta({
	layout: 'client'
})

const { $api } = useNuxtApp()
const route = useRoute()
const uid = route.query.uid as string | undefined

const { data, status, refresh } = await useAsyncData(
	'newsletter-confirmation',
	() => {
		if (uid) {
			return $api.newsletter.confirmSubscription(uid ?? '')
		} else {
			return Promise.resolve(null)
		}
	}
)

const subscribeSuccess = computed(() => {
	return data.value?.code === 201
})
</script>

<style scoped></style>
