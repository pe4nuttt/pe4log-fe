export function isHtmlContentEmpty(html: string): boolean {
	const parser = new DOMParser()
	const doc = parser.parseFromString(html, 'text/html')
	const text = doc.body.textContent || ''
	return text.replace(/\u00a0/g, '').trim().length === 0
}
