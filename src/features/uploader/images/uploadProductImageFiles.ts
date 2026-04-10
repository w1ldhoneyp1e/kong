import {readFileAsDataUrl} from '../../../shared'

async function uploadProductImageFiles(files: File[]): Promise<string[]> {
	const list = files.filter(file => file.type.startsWith('image/'))
	if (list.length === 0) {
		return []
	}

	if (process.env.NODE_ENV === 'development') {
		const formData = new FormData()
		for (const file of list) {
			formData.append('file', file)
		}

		const response = await fetch('/api/dev-product-images', {
			method: 'POST',
			body: formData,
			credentials: 'same-origin',
		})

		if (!response.ok) {
			const data = (await response.json().catch(() => ({}))) as {error?: string}
			throw new Error(
				typeof data.error === 'string'
					? data.error
					: 'Не удалось сохранить файлы',
			)
		}

		const payload = (await response.json()) as {urls?: string[]}
		return payload.urls ?? []
	}

	const urls: string[] = []
	for (const file of list) {
		urls.push(await readFileAsDataUrl(file))
	}

	return urls
}

export {
	uploadProductImageFiles,
}
