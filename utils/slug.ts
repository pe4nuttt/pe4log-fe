import slugify from 'slugify'

export function generateSlug(title: string): string {
	return slugify(title, {
		lower: true,
		strict: true,
		locale: 'vi'
	})
}

export function generateHeadingId(title: string): string {
	title = title
		.trim()
		.replace(/^[\d.()]+[\s:)\-–—]+/, '')
		.replace(/^[^\w]+/, '')
		.replace(/\[.*?\]/g, '')

	return slugify(title, {
		lower: true,
		strict: true,
		locale: 'vi'
	})
}
