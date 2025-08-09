<template>
	<div id="newsletter" class="rounded-md text-white">
		<h3 class="mb-2 text-2xl font-bold">Stay updated!</h3>
		<p class="">Sign up for our newsletter</p>

		<div
			class="my-4 flex flex-col flex-wrap gap-x-1 gap-y-2 rounded-lg border border-white/20 bg-white/10 p-2 sm:flex-row"
		>
			<Input
				id="email"
				v-model="email"
				type="text"
				placeholder="Enter your email address"
				class="h-9 min-h-9 flex-1 !border-white/30 bg-white text-black focus-visible:ring-2 focus-visible:ring-white/30"
			/>
			<Button
				class="border-white/30 bg-white/20 text-white transition-all hover:translate-y-[-2px] hover:bg-white/40"
				:disabled="disableSubscribeBtn"
				@click="onClickSubscribe"
			>
				Subscribe
			</Button>
		</div>

		<div class="newsletter-features flex flex-wrap gap-x-4 gap-y-1">
			<div class="newsletter-feature flex items-center gap-2">
				<div class="newsletter-feature-icon">📧</div>
				<span class="text-sm">Weekly updates</span>
			</div>
			<!-- <div class="newsletter-feature flex items-center gap-2">
				<div class="newsletter-feature-icon">🚀</div>
				<span class="text-sm">Latest tech trends</span>
			</div> -->
			<div class="newsletter-feature flex items-center gap-2">
				<div class="newsletter-feature-icon">🎯</div>
				<span class="text-sm">No spam, unsubscribe anytime</span>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { EMAIL_REGEX } from '~/utils/constants'

const { $api } = useNuxtApp()
const { toastSuccess, toastError } = useAppToast()

const email = ref('')
const isSubscribing = ref(false)

const disableSubscribeBtn = computed(() => {
	return !EMAIL_REGEX.test(email.value) || isSubscribing.value
})

const onClickSubscribe = async () => {
	try {
		isSubscribing.value = true
		const res = await $api.newsletter.subscribe({
			email: email.value
		})

		email.value = ''

		toastSuccess(res.message)
	} catch (error) {
		toastError(error)
	} finally {
		isSubscribing.value = false
	}
}
</script>

<style scoped lang="scss">
#newsletter {
	background: linear-gradient(to left top, rgb(2, 170, 176), rgb(0, 205, 172));
}
</style>
