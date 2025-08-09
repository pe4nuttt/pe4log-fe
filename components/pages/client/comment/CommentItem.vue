<!-- eslint-disable vue/no-deprecated-slot-attribute -->
<template>
	<details
		class="mb-3 last:mb-0 last:[&>div>.comment-actions]:mb-0"
		:open="isOpen"
		@toggle="onToggleOpen"
	>
		<summary
			class="grid grid-cols-[24px_minmax(0,1fr)] sm:grid-cols-[32px_minmax(0,1fr)]"
		>
			<div class="flex h-6 w-6 items-center justify-center sm:h-8 sm:w-8">
				<Avatar v-show="isOpen" class="h-full w-full">
					<AvatarImage
						:src="
							img(
								comment.user?.profilePicture ?? '',
								{},
								{
									provider: 'cloudinary'
								}
							)
						"
						:alt="
							getNameShorthand(
								`${comment.user?.firstName} ${comment.user?.lastName}`
							)
						"
					/>
					<AvatarFallback>
						{{
							getNameShorthand(
								`${comment.user?.firstName} ${comment.user?.lastName}`
							)
						}}
					</AvatarFallback>
				</Avatar>
				<Button
					v-show="!isOpen"
					variant="ghost"
					size="sm"
					class="h-auto w-auto !bg-background p-[2px] [&>svg]:size-6"
					@click="fnToggleOpen"
				>
					<CirclePlus />
				</Button>
			</div>
			<div class="ml-3 flex items-center gap-x-3">
				<span class="text-sm font-medium">
					{{
						isCurrentUser
							? 'You'
							: `${comment.user.firstName} ${comment.user.lastName}`
					}}
				</span>
				<time
					v-tooltip="formatFullDate(comment.createdAt)"
					class="text-xs"
					:datetime="dayjs(comment.createdAt).toISOString()"
				>
					{{ timeAgo(comment.createdAt) }}
				</time>
			</div>
		</summary>

		<div class="relative grid grid-cols-[24px_1fr] sm:grid-cols-[32px_1fr]">
			<div
				class="group/indicator line-indicator absolute z-0 flex h-full w-[24px] cursor-pointer justify-center sm:w-[32px]"
				@mouseover="indicatorHover = true"
				@mouseleave="indicatorHover = false"
				@click="fnToggleOpen"
			>
				<div
					v-if="comment?.children?.length"
					class="h-full w-[1px] bg-border group-hover/indicator:bg-ring"
				></div>
			</div>
			<div></div>
			<div v-dompurify-html="comment.content" class="mb-1 ml-3"></div>
			<div class="z-10 flex items-center justify-center">
				<Button
					v-show="isOpen && comment?.children?.length"
					variant="ghost"
					size="sm"
					class="h-auto w-auto !bg-background p-[2px] [&>svg]:size-6"
					@click="fnToggleOpen"
				>
					<CircleMinus />
				</Button>
			</div>
			<div class="comment-actions mb-2 flex items-center gap-3">
				<span class="flex items-center gap-1">
					<Button
						variant="ghost"
						size="icon"
						class="h-7 w-auto gap-1 rounded-full px-[10px] text-muted-foreground hover:text-green-500"
						:class="{
							'text-green-500': comment.isLiked
						}"
						:disabled="isUpdatingLike"
						@click="fnLikeComment"
					>
						<Icon name="mdi:thumbs-up" />
						<span class="text-sm">{{ comment.likesCount }}</span>
					</Button>
					<Button
						variant="ghost"
						size="icon"
						class="h-7 w-auto gap-1 rounded-full px-[10px] text-muted-foreground hover:text-destructive"
						:class="{
							'text-destructive': comment.isDisliked
						}"
						:disabled="isUpdatingDislike"
						@click="fnDislikeComment"
					>
						<Icon name="mdi:thumbs-down" />
						<span class="text-sm">{{ comment.dislikesCount }}</span>
					</Button>
				</span>
				<span>
					<Button
						variant="ghost"
						size="icon"
						class="h-7 w-auto gap-1 rounded-full px-[10px] text-muted-foreground"
						@click="fnToggleReply"
					>
						<Icon name="ion:chatbubble-ellipses-sharp" />
						<span class="text-sm">Reply</span>
					</Button>
				</span>
			</div>
			<template v-if="showReply">
				<div></div>
				<CommentEditor
					:parent-id="comment.id"
					class="mb-2"
					@cancel="fnToggleReply"
					@new-comment="onNewComment"
				/>
			</template>

			<template
				v-for="(childComment, index) in comment.children ?? []"
				:key="childComment.id"
			>
				<div
					aria-hidden="true"
					class="thread-line pointer-events-none relative flex items-start justify-end"
					:class="[
						{
							'pointer-events-auto bg-background':
								comment?.children?.length &&
								index === comment.children.length - 1
						}
					]"
				>
					<div
						class="branch-line box-border h-4 w-[calc(50%+0.5px)] cursor-pointer rounded-bl-[12px] border-0 border-b-[1px] border-l-[1px]"
						:class="{
							'border-ring': indicatorHover
						}"
						@mouseover="indicatorHover = true"
						@mouseleave="indicatorHover = false"
						@click="fnToggleOpen"
					/>
				</div>
				<pages-client-comment-item :comment="childComment" />
			</template>
		</div>
	</details>
</template>

<script setup lang="ts">
import {
	CircleMinus,
	CirclePlus,
	MessageCircle,
	ThumbsDown,
	ThumbsUp
} from 'lucide-vue-next'
import type { IComment, ICommentTreeNode } from '~/types/comments'
import CommentEditor from './CommentEditor.vue'
import { useVModel } from '@vueuse/core'

interface IProps {
	comment: ICommentTreeNode
}

const props = defineProps<IProps>()

const img = useImage()
const dayjs = useDayjs()
const { $api } = useNuxtApp()
const { toastSuccess, toastError } = useAppToast()
const userStore = useUserStore()

const comment = useVModel(props, 'comment', undefined, {
	clone: true,
	passive: true
})
const showReply = ref(false)
const isOpen = ref(true)
const indicatorHover = ref(false)
const isUpdatingLike = ref(false)
const isUpdatingDislike = ref(false)

const isCurrentUser = computed(() => {
	return userStore.user?.id === comment.value.user.id
})

const fnToggleReply = () => {
	showReply.value = !showReply.value
}

const fnToggleOpen = () => {
	isOpen.value = !isOpen.value
}

const onToggleOpen = (event: any) => {
	isOpen.value = event.newState === 'open'
}

const fnLikeComment = async () => {
	try {
		isUpdatingLike.value = true
		const response = await $api.commentReactions.likeComment(props.comment.id)

		if (!response.data) {
			throw 'Failed to like comment'
			return
		}

		const { dislikesCount, likesCount, userLikeStatus } = response.data
		comment.value.likesCount = likesCount
		comment.value.dislikesCount = dislikesCount
		comment.value.isLiked = userLikeStatus.isLiked
		comment.value.isDisliked = userLikeStatus.isDisliked
		toastSuccess(response.message)
	} catch (error) {
		toastError(error)
	} finally {
		isUpdatingLike.value = false
	}
}

const fnDislikeComment = async () => {
	try {
		isUpdatingDislike.value = true
		const response = await $api.commentReactions.dislikeComment(
			props.comment.id
		)

		if (!response.data) {
			throw 'Failed to dislike comment'
		}

		const { dislikesCount, likesCount, userLikeStatus } = response.data
		comment.value.likesCount = likesCount
		comment.value.dislikesCount = dislikesCount
		comment.value.isLiked = userLikeStatus.isLiked
		comment.value.isDisliked = userLikeStatus.isDisliked
		toastSuccess(response.message)
	} catch (error) {
		toastError(error)
	} finally {
		isUpdatingDislike.value = false
	}
}

const onNewComment = (newComment: IComment) => {
	const newCommentNode: ICommentTreeNode = {
		...newComment,
		children: [],
		isLiked: false,
		isDisliked: false,
		likesCount: 0,
		dislikesCount: 0,
		user: userStore.user!
	}
	if (!comment.value.children) {
		comment.value.children = []
	}
	comment.value.children.push(newCommentNode)
	showReply.value = false
}
</script>

<style scoped lang="scss">
// .line-indicator:hover {
// 	& ~ .thread-line > .branch-line {
// 		border-color: red;
// 	}
// }
</style>
