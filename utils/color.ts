import { TAG_COLORS } from './constants'

export function setOpacityForRgbaColor(rgbaColor: string, opacity: number) {
	return rgbaColor.replace(
		/rgba\((\d+),\s*(\d+),\s*(\d+),\s*[\d.]+\)/,
		`rgba($1, $2, $3, ${opacity})`
	)
}

export function getCSSVariableValue(variableName: string) {
	if (getComputedStyle && document.documentElement)
		return getComputedStyle(document.documentElement)
			.getPropertyValue(variableName)
			.trim()
}

export const getTagLabelByColor = (color: string) => {
	const tag = TAG_COLORS.find((tag) => tag.color === color)
	return tag ? tag.label : null
}

export const getTagBackgroundFromColor = (color: string) => {
	return `color-mix(in srgb, ${color}, white 50%)`
}

export const hexToRgba = (hex: string, alpha: number = 1) => {
	hex = hex.replace(/^#/, '')

	// Parse r, g, b values
	let r, g, b
	if (hex.length === 3) {
		// Handle shorthand hex (#RGB)
		r = parseInt(hex[0] + hex[0], 16)
		g = parseInt(hex[1] + hex[1], 16)
		b = parseInt(hex[2] + hex[2], 16)
	} else if (hex.length === 6) {
		// Handle full hex (#RRGGBB)
		r = parseInt(hex.substring(0, 2), 16)
		g = parseInt(hex.substring(2, 4), 16)
		b = parseInt(hex.substring(4, 6), 16)
	} else {
		throw new Error('Invalid hex color format')
	}

	// Return in rgba format
	return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
