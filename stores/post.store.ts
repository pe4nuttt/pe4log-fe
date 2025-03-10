import type { IPost } from '~/types'

export const usePostStore = defineStore('post', () => {
	const { $api } = useNuxtApp()

	const post = ref<IPost | null>()

	const openPost = async (postId: IPost['id']) => {}

	const closePost = async () => {
		post.value = null
	}

	const getPostDetails = async (postId: IPost['id']) => {
		try {
			const res = await $api.posts.getPostDetails(postId)
			post.value = res.data
		} catch (error) {
			post.value = null
			throw error
		}
	}

	return {
		post,
		openPost,
		closePost,
		getPostDetails
	}
})
