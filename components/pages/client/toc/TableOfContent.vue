<template>
	<div class="space-y-2">
		<h2 class="text-xl font-semibold">Table of Contents</h2>

		<ul class="border-l-2 border-l-muted">
			<!-- <TableOfContentItem
				v-for="item in items"
				:key="item.id ?? undefined"
				:item="item"
			/> -->

			<li
				v-for="item in tableOfContent"
				:key="item.id ?? undefined"
				:style="{
					'padding-left': `${item.level * 12}px`
				}"
				class="inline-block w-full py-[2px] transition-[margin,color] hover:text-foreground"
				:class="[
					item.id === activeId
						? 'ml-[-2px] border-l-2 border-l-muted-foreground font-semibold text-foreground'
						: 'text-muted-foreground'
				]"
			>
				<a v-if="item.text" :href="`#${item.id}`">
					{{ item.text }}
				</a>
			</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
import type { TOCItem } from '~/types'
// import TableOfContentItem from './TableOfContentItem.vue'

// const props = defineProps<{
// 	items: TOCItem[]
// }>()

const clientBlogStore = useClientBlogStore()

const { tableOfContent, activeId } = storeToRefs(clientBlogStore)
</script>

<style scoped></style>
