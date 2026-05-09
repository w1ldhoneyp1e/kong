import {getBackendUrl} from '../../shared'

type StoreSettings = {
	id: string,
	name: string,
	commerce_enabled: boolean,
}

async function getStoreSettings(): Promise<StoreSettings | null> {
	try {
		const res = await fetch(`${getBackendUrl()}/store`, {
			cache: 'no-store',
		})
		if (!res.ok) {
			return null
		}

		const data = (await res.json().catch(() => ({}))) as {store?: StoreSettings}
		return data.store ?? null
	}
	catch {
		return null
	}
}

export {getStoreSettings}
export type {StoreSettings}
