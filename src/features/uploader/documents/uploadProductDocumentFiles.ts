import {readFileAsDataUrl} from '../../../shared'

type UploadedProductDocument = {
	title: string,
	url: string,
}

function getDocumentTitleFromFileName(fileName: string): string {
	const normalized = fileName.trim()
	if (!normalized) {
		return 'Документ'
	}

	const withoutExt = normalized.replace(/\.[^/.]+$/, '').trim()
	if (withoutExt) {
		return withoutExt
	}

	return normalized
}

async function uploadProductDocumentFiles(files: File[]): Promise<UploadedProductDocument[]> {
	if (files.length === 0) {
		return []
	}

	if (process.env.NODE_ENV === 'development') {
		const formData = new FormData()
		for (const file of files) {
			formData.append('file', file)
		}

		const response = await fetch('/api/dev-product-documents', {
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

		const payload = (await response.json()) as {
			items?: {
				url: string,
				title: string,
			}[],
		}

		return payload.items ?? []
	}

	const uploaded: UploadedProductDocument[] = []
	for (const file of files) {
		const url = await readFileAsDataUrl(file)
		uploaded.push({
			title: getDocumentTitleFromFileName(file.name),
			url,
		})
	}

	return uploaded
}

export {
	getDocumentTitleFromFileName,
	uploadProductDocumentFiles,
}
export type {UploadedProductDocument}
