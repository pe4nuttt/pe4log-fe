<template>
	<li>
		<a
			v-if="item.text"
			:href="`#${item.id}`"
			class="inline-block w-full transition-colors hover:text-foreground"
			:class="[
				item.id === activeId
					? 'font-semibold text-foreground'
					: 'text-muted-foreground'
			]"
			@click.prevent="onClickTocItem(item)"
		>
			{{ item.text }}
		</a>

		<ul v-if="item.children.length" class="ml-3 space-y-1">
			<PagesClientTocTableOfContentItem
				v-for="child in item.children"
				:key="child.id ?? undefined"
				:item="child"
			/>
		</ul>
	</li>
</template>

<script setup lang="ts">
import type { TOCItem } from '~/types'

interface IProps {
	item: TOCItem
}

const props = defineProps<IProps>()
const route = useRoute()
const router = useRouter()
const clientBlogStore = useClientBlogStore()
const { activeId } = storeToRefs(clientBlogStore)

const onClickTocItem = (item: TOCItem) => {
	if (!item.id) return

	const ele = document.getElementById(item.id)

	if (ele) {
		window.scrollTo({
			top: ele.offsetTop - 80,
			behavior: 'smooth'
		})

		router.replace({
			hash: `#${item.id}`,
			replace: true
		})

		// history.replaceState(null, '', `#${item.id}`)
	}
}
</script>

<style scoped></style>
