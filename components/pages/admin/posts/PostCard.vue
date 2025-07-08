<template>
	<div
		class="inset-shadow-sm group flex cursor-pointer flex-col overflow-hidden rounded-md border shadow-md dark:shadow-sm dark:shadow-muted"
	>
		<div class="p-3 pb-0">
			<NuxtImg
				v-if="post.coverImage"
				:src="post.coverImage"
				class="h-40 w-full rounded-sm object-cover"
			/>
			<NuxtImg
				v-else
				:src="blankImage"
				class="h-40 w-full rounded-sm bg-muted"
			/>
		</div>

		<div class="flex flex-1 flex-col p-4">
			<div class="flex items-center justify-between gap-4">
				<div>
					<Badge v-if="post.category?.name">{{ post.category.name }}</Badge>
				</div>
				<div class="flex items-center gap-1">
					<Badge>{{ post.lang }}</Badge>
					<Badge>{{ capitalizeFirstLetter(post.status) }}</Badge>
				</div>
			</div>
			<h3 class="mb-1 mt-3 line-clamp-2 text-lg font-semibold">
				{{ post.title }}
			</h3>

			<p class="line-clamp-3 flex-1 text-sm text-muted-foreground">
				{{ post.description }}
			</p>

			<div class="mt-2 flex items-center gap-x-2">
				<Avatar class="h-8 w-8 bg-slate-500">
					<AvatarFallback>CN</AvatarFallback>
				</Avatar>
				<div class="flex flex-1 flex-wrap items-center justify-between gap-1">
					<span class="text-sm font-medium">
						{{ `${post.author.firstName} ${post.author.lastName}` }}
					</span>
					<span class="text-sm text-muted-foreground">
						{{ dayjs(post.publishedAt).format('MMMM D, YYYY') }}
					</span>
				</div>
			</div>

			<div
				v-if="post.tags.length"
				class="mt-3 flex flex-wrap items-center gap-1"
			>
				<Badge v-for="tag in post.tags" :key="tag.id">{{ tag.name }}</Badge>
			</div>

			<Separator class="my-4" />

			<div class="flex items-center justify-between">
				<div>
					<Button variant="outline" size="sm">
						<Languages />
						To English
					</Button>
				</div>

				<div class="flex gap-x-1">
					<Button variant="outline" size="sm" @click="$emit('edit', post)">
						<Pencil />
					</Button>
					<Button
						variant="destructive"
						size="sm"
						@click="$emit('delete', post)"
					>
						<Trash class="text-destructive-foreground" />
					</Button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { EPostStatus, type IPost } from '~/types'
import blankImage from '@/assets/images/blank_image.svg'
import { Button } from '~/components/ui/button'
import { Languages, Pencil, Trash } from 'lucide-vue-next'
import { Separator } from '~/components/ui/separator'

interface Props {
	post: IPost
}

const props = defineProps<Props>()

const emits = defineEmits<{
	edit: [IPost]
	delete: [IPost]
}>()
const dayjs = useDayjs()
</script>

<style scoped></style>
