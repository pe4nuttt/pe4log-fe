<template>
	<div className="flex flex-wrap gap-1 items-center">
		<!-- {{ params.tags.join(', ') }} -->
		<Badge
			v-for="tag in params.tags"
			:key="tag.id"
			:style="{
				color: tag.color,
				background: getTagBackgroundFromColor(tag.color!)
			}"
		>
			{{ tag.name }}
		</Badge>
	</div>
</template>

<script setup lang="ts">
import { Badge } from '@/components/ui/badge'
import type { ITag } from '~/types'
interface Props {
	params: {
		tags: ITag[]
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		[key: string]: any
	}
}

const props = defineProps<Props>()

onMounted(() => {})
</script>

<style lang="scss" scoped></style>
