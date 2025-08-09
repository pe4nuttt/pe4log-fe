import type {
	IApiReponse,
	IPaginationRes,
	IBodyNewsletterSubscribe
} from '~/types'
import HttpFactory from '../factory'

class NewsletterModule extends HttpFactory {
	private readonly RESOURCE = '/newsletter'

	async subscribe(body: IBodyNewsletterSubscribe) {
		return this.call<IApiReponse<any>>(
			'POST',
			`${this.RESOURCE}/subscription`,
			body
		)
	}

	async confirmSubscription(uid: string) {
		return this.call<IApiReponse<any>>(
			'POST',
			`${this.RESOURCE}/confirm-subscription/${uid}`
		)
	}
}

export default NewsletterModule
