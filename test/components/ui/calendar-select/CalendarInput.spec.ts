import CalendarInput from '~/components/ui/calendar-select/CalendarInput.vue'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { expect, it, describe } from 'vitest'
import { ref, nextTick } from 'vue'

describe('CalendarInput Component', () => {
	it('should render CalendarInput component', async () => {
		const modelValue = ref('2025-01-01')

		const component = await mountSuspended(CalendarInput, {
			props: {
				modelValue: modelValue.value
			}
		})

		const value = component.find('input').element.value

		expect(value).equal('2025-01-01')
	})

	it('should update the input value when modelValue changes', async () => {
		const modelValue = ref('2025-01-01')

		const component = await mountSuspended(CalendarInput, {
			props: {
				modelValue: modelValue.value
			}
		})

		modelValue.value = '2025-12-31'
		await component.setProps({ modelValue: modelValue.value })
		await nextTick()
		await component.vm.$nextTick()
		const value = component.find('input').element.value
		expect(value).equal('2025-12-31')
	})

	it('should emit an update:modelValue event when input value changes', async () => {
		const modelValue = ref('2025-01-01')

		const component = await mountSuspended(CalendarInput, {
			props: {
				modelValue: modelValue.value
			}
		})

		const input = component.find('input')
		await input.setValue('2025-06-15')

		expect(component.emitted('update:modelValue')).toBeTruthy()
		const emittedDate = component.emitted('update:modelValue')?.[0]?.[0] as Date
		const expectedDate = new Date('2025-06-15T00:00:00')

		expect(emittedDate.getFullYear()).toBe(expectedDate.getFullYear())
		expect(emittedDate.getMonth()).toBe(expectedDate.getMonth())
		expect(emittedDate.getDate()).toBe(expectedDate.getDate())
	})

	it('should render placeholder if provided', async () => {
		const placeholder = 'Select a date'

		const component = await mountSuspended(CalendarInput, {
			props: {
				placeholder
			}
		})

		const input = component.find('input')

		expect(input.attributes('placeholder')).toBe(placeholder)
	})
})
