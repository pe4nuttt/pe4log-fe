<template>
	<div class="mt-24 h-[2000px] md:mt-28">
		<section id="section-intro" class="xl:gap8 flex flex-col gap-4 md:gap-6">
			<h1 class="text-3xl md:text-5xl">Hello, World!</h1>
			<div
				class="flex max-w-[90%] flex-col gap-4 md:max-w-[80%] xl:max-w-[70%]"
			>
				<p
					class="text-lg text-muted-foreground md:text-xl"
					v-html="
						$t('homePageIntroText', {
							name: 'John Doe',
							role: 'UX Engineer',
							tools: 'Figma, Framer, Design Systems and Web Development'
						})
					"
				/>

				<div>
					<Button variant="outline" class="text-muted-foreground">
						{{ $t('readMoreAboutMe').toLowerCase() }}
					</Button>
				</div>
			</div>
		</section>
	</div>
</template>

<script setup lang="ts">
import Button from '~/components/ui/button/Button.vue'

definePageMeta({
	layout: 'client'
})
</script>

<style scoped></style>
