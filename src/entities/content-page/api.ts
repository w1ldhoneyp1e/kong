import {getApiBase, getBackendUrl} from '../../shared'

type ContentPage = {
	id: string,
	slug: string,
	title: string,
	description: string | null,
	body: string,
	updated_at: string,
}

const contentPageApi = {
	listPages: async (): Promise<ContentPage[]> => {
		const res = await fetch(`${getApiBase()}/pages`, {
			credentials: 'same-origin',
		})
		const data = await res.json().catch(() => ({})) as {pages?: ContentPage[]}
		if (!res.ok) {
			throw new Error((data as {error?: string}).error ?? 'Не удалось загрузить страницы')
		}

		return data.pages ?? []
	},

	updatePage: async (
		slug: string,
		payload: {
			title: string,
			description?: string | null,
			body: string,
		},
	): Promise<ContentPage> => {
		const res = await fetch(`${getApiBase()}/pages/${slug}`, {
			method: 'PUT',
			credentials: 'same-origin',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify(payload),
		})
		const data = await res.json().catch(() => ({})) as {
			page?: ContentPage,
			error?: string,
			message?: string,
		}
		if (!res.ok || !data.page) {
			throw new Error(data.error ?? data.message ?? 'Не удалось сохранить страницу')
		}

		return data.page
	},
}

async function getContentPageBySlug(slug: string): Promise<ContentPage | null> {
	try {
		const res = await fetch(`${getBackendUrl()}/pages/${slug}`, {
			cache: 'no-store',
		})
		if (!res.ok) {
			return null
		}

		const data = await res.json().catch(() => ({})) as {page?: ContentPage | null}
		return data.page ?? null
	}
	catch {
		return null
	}
}

export {contentPageApi, getContentPageBySlug}
export type {ContentPage}
