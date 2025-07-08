export function convertFileToUrl(
	file: File,
	callback: (url: string) => void
): void {
	const reader = new FileReader()

	reader.onload = function (event: ProgressEvent<FileReader>): void {
		const fileUrl = event.target?.result as string

		callback(fileUrl)
	}

	reader.readAsDataURL(file)
}
