import {cookies} from 'next/headers'
import {getBackendUrl} from '../../../shared'
import {StoreSettingsPageClient} from './StoreSettingsPageClient'

const STAFF_TOKEN_COOKIE = 'kong_staff_token'

type StoreSettings = {
	id: string,
	name: string,
	commerce_enabled: boolean,
}

async function fetchInitialStore(): Promise<StoreSettings | null> {
	const staffToken = (await cookies()).get(STAFF_TOKEN_COOKIE)?.value
	if (!staffToken) {
		return null
	}

	try {
		const res = await fetch(`${getBackendUrl()}/store`, {
			headers: {Authorization: `Bearer ${staffToken}`},
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

export default async function AdminStorePage() {
	const initialStore = await fetchInitialStore()

	return <StoreSettingsPageClient initialStore={initialStore} />
}
