import dayjs from 'dayjs'
import { useI18n } from 'vue-i18n'

export function timeAgo(date: string | Date | number): string {
	const { t } = useI18n()
	const now = dayjs()
	const created = dayjs(date)
	const diffInMinutes = now.diff(created, 'minute')
	const diffInHours = now.diff(created, 'hour')
	const diffInDays = now.diff(created, 'day')
	const diffInWeeks = now.diff(created, 'week')
	const diffInMonths = now.diff(created, 'month')
	const diffInYears = now.diff(created, 'year')

	if (diffInYears > 0) {
		return t('date.yearsAgo', { count: diffInYears })
	}
	if (diffInMonths > 0) {
		return t('date.monthsAgo', { count: diffInMonths })
	}
	if (diffInWeeks > 0) {
		return t('date.weeksAgo', { count: diffInWeeks })
	}
	if (diffInDays > 0) {
		return t('date.daysAgo', { count: diffInDays })
	}
	if (diffInHours > 0) {
		return t('date.hoursAgo', { count: diffInHours })
	}
	if (diffInMinutes > 0) {
		return t('date.minutesAgo', { count: diffInMinutes })
	}
	return t('date.justNow')
}

export function formatFullDate(date: string | Date | number): string {
	return dayjs(date).format('dddd, MMMM D, YYYY [at] hh:mm:ss A [GMT]Z')
}
