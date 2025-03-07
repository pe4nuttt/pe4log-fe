import _ from 'lodash'

export default defineNuxtPlugin(() => {
	return {
		provide: {
			_: _
		}
	}
})
