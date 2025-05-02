<template>
	<header
		class="sticky top-0 z-[100] flex items-center justify-between gap-8 bg-inherit px-4 py-4 text-muted-foreground backdrop-blur-sm md:px-5 xl:px-8"
	>
		<NuxtLink to="/" class="text-lg font-semibold text-foreground">
			Pe4nuttt.blog
		</NuxtLink>

		<div
			class="flex h-8 items-center gap-4 rounded-xl border bg-background px-4 py-1"
		>
			<NuxtLink
				to="/"
				active-class="text-foreground"
				class="text-sm hover:text-foreground"
			>
				Home
			</NuxtLink>
			<Separator orientation="vertical" />
			<NuxtLink
				to="/blog"
				active-class="text-foreground"
				class="text-sm hover:text-foreground"
			>
				Blog
			</NuxtLink>
			<Separator orientation="vertical" />
			<NuxtLink
				to="/about"
				active-class="text-foreground"
				class="text-sm hover:text-foreground"
			>
				About
			</NuxtLink>
		</div>

		<div class="flex items-center gap-2">
			<Button variant="outline" size="icon" @click="handleToggleTheme">
				<ClientOnly>
					<Icon
						:name="$colorMode.value === 'dark' ? 'lucide:moon' : 'lucide:sun'"
					/>
				</ClientOnly>
			</Button>
			<Button variant="outline" @click="navigateTo('/auth/sign-in')">
				Login
			</Button>
		</div>
	</header>
</template>

<script setup lang="ts">
import { Separator } from '@/components/ui/separator'

const colorMode = useColorMode()

const handleToggleTheme = () => {
	if (colorMode.value === 'dark') {
		colorMode.preference = 'light'
	} else {
		colorMode.preference = 'dark'
	}
}
</script>

<style scoped></style>
