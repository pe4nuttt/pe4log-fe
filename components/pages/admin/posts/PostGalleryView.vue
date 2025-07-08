<template>
	<div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
		<PostCard
			v-for="post in posts"
			:key="post.id"
			:post="post"
			class="h-full"
			@edit="emits('edit', $event)"
			@delete="emits('delete', $event)"
		/>
	</div>
</template>

<script setup lang="ts">
import type { IPost } from '~/types'
import PostCard from './PostCard.vue'

interface Props {
	posts: IPost[]
}

const props = defineProps<Props>()

const emits = defineEmits<{
	edit: [IPost]
	delete: [IPost]
}>()
</script>

<style scoped></style>
