<template>
	<section
		id="section-intro"
		class="flex flex-col gap-4 rounded-md px-4 py-28 md:gap-6 xl:gap-8"
	>
		<h1 class="text-3xl md:text-5xl">Hello, World!</h1>
		<div class="flex max-w-[90%] flex-col gap-4 md:max-w-[80%] xl:max-w-[70%]">
			<!-- <p
					class="text-lg text-muted-foreground md:text-xl"
					v-html="
						$t('homePageIntroText', {
							name: 'John Doe',
							role: 'UX Engineer',
							tools: 'Figma, Framer, Design Systems and Web Development'
						})
					"
				/> -->
			<p class="text-lg text-muted-foreground md:text-xl">
				I'm
				<span class="font-bold text-primary">Anh Nguyen Tien</span>
				— aka
				<span
					v-html="`<span class='font-bold text-primary'>pe4nuttt</span>.`"
				/>
				I'm a software engineer who turns coffee into code, and bugs into
				“features.”
			</p>

			<div>
				<Button variant="outline" class="text-muted-foreground">
					{{ $t('readMoreAboutMe').toLowerCase() }}
				</Button>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
import Button from '~/components/ui/button/Button.vue'

definePageMeta({
	layout: 'client'
})
</script>

<style scoped>
#section-intro {
	/* background-image: url('https://images.alphacoders.com/135/thumbbig-1351306.webp');
	background-size: cover;
	background-position: center;
	background-repeat: no-repeat; */
}
</style>
