<template>
	<div>
		<CommentItem
			v-for="comment in postCommentList"
			:key="comment.id"
			:comment="comment"
		/>
	</div>
</template>

<script setup lang="ts">
import type { ICommentTreeNode } from '~/types'
import CommentItem from './CommentItem.vue'

const clientBlogStore = useClientBlogStore()
const { postComments } = storeToRefs(clientBlogStore)

const postCommentList = ref<ICommentTreeNode[]>([])

watch(
	postComments,
	(newComments) => {
		postCommentList.value = newComments
	},
	{ immediate: true }
)
</script>

<style scoped></style>
