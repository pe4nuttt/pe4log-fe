export function capitalizeFirstLetter(val?: string | undefined) {
	if (!val) {
		return ''
	}
	return String(val).charAt(0).toUpperCase() + String(val).slice(1)
}

export function getNameShorthand(name: string): string {
	if (!name.trim()) return ''

	const parts = name.trim().split(/\s+/)

	if (parts.length === 1) {
		return parts[0].substring(0, 2).toUpperCase()
	}

	const firstInitial = parts[0][0]
	const lastInitial = parts[parts.length - 1][0]

	return (firstInitial + lastInitial).toUpperCase()
}
