import * as cheerio from 'cheerio'
import type { TOCItem } from '~/types'

function insertIntoTOC(toc: TOCItem[], item: TOCItem): void {
	if (item.level === 1) {
		toc.push(item)
		return
	}

	let currentLevel = 1
	let currentList = toc

	while (currentLevel < item.level - 1) {
		if (
			currentList.length === 0 ||
			currentList[currentList.length - 1].level < currentLevel
		) {
			const placeholder: TOCItem = {
				id: null,
				text: null,
				level: currentLevel,
				children: []
			}
			currentList.push(placeholder)
		}

		const last = currentList[currentList.length - 1]
		currentList = last.children
		currentLevel++
	}

	const last = currentList[currentList.length - 1]
	if (!last || last.level !== item.level) {
		const placeholder: TOCItem = {
			id: null,
			text: null,
			level: item.level - 1,
			children: []
		}
		currentList.push(placeholder)
		currentList = placeholder.children
	} else {
		currentList = last.children
	}

	currentList.push(item)
}

export function extractNestedTOC(html: string): TOCItem[] {
	const $ = cheerio.load(html)
	const headings = $('h1, h2, h3, h4, h5, h6')
	const toc: TOCItem[] = []

	headings.each((_, el) => {
		const level = parseInt(el.tagName[1], 10)
		const id = $(el).attr('id') || null
		const text = $(el).text().trim() || null

		const item: TOCItem = {
			id,
			text,
			level,
			children: []
		}

		insertIntoTOC(toc, item)
	})

	return toc
}
