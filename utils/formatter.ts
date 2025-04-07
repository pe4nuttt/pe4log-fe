export function capitalizeFirstLetter(val?: string | undefined) {
	if (!val) {
		return ''
	}
	return String(val).charAt(0).toUpperCase() + String(val).slice(1)
}
