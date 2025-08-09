import type { IPost } from '~/types'
import * as cheerio from 'cheerio'
import type { IComment, ICommentTreeNode } from '~/types/comments'

export const useClientBlogStore = defineStore('client-blog', () => {
	const route = useRoute()
	const { $api } = useNuxtApp()
	const userStore = useUserStore()
	const slug = route.params.slug as string
	const postDetails = ref<IPost | null>(null)
	const postHtmlContent = ref<string | null>(null)
	const postComments = ref<ICommentTreeNode[]>([])
	const { activeId } = useActiveHeading(
		'.blog-prose h1, .blog-prose h2, .blog-prose h3'
	)

	const fetchPostDetail = async () => {
		try {
			const res = await $api.posts.getPostDetailByClient(slug)
			postDetails.value = res.data
			return res
		} catch (error) {
			postDetails.value = null
			throw error
		}
	}

	const fetchPostHtmlContent = async () => {
		try {
			const res = await $api.posts.getPostHtmlContent(slug)
			postHtmlContent.value = res.data
			return res
		} catch (error) {
			postHtmlContent.value = null
			throw error
		}
	}

	const fetchPostComments = async () => {
		try {
			const res = await $api.comments.getCommentTree(slug)
			postComments.value = res.data ?? []
			return res
		} catch (error) {
			postComments.value = []
			throw error
		}
	}

	const tableOfContentItems = computed(() => {
		if (!postHtmlContent.value) return []

		return extractNestedTOC(postHtmlContent.value)
	})

	const tableOfContent = computed(() => {
		if (!postHtmlContent.value) return []

		const $ = cheerio.load(postHtmlContent.value)
		const headings = $('h1, h2, h3, h4, h5, h6')

		return headings.map((_, el) => ({
			id: $(el).attr('id') || null,
			text: $(el).text().trim() || null,
			level: parseInt(el.tagName[1], 10)
		}))
	})

	const onNewTopLevelComment = (newComment: IComment) => {
		const newCommentNode: ICommentTreeNode = {
			...newComment,
			children: [],
			isLiked: false,
			isDisliked: false,
			likesCount: 0,
			dislikesCount: 0,
			user: userStore.user!
		}
		postComments.value.unshift(newCommentNode)
	}

	return {
		postDetails,
		postHtmlContent,
		postComments,
		tableOfContentItems,
		activeId,
		tableOfContent,
		fetchPostDetail,
		fetchPostHtmlContent,
		fetchPostComments,
		onNewTopLevelComment
	}
})
