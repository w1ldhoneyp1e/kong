import {cookies} from 'next/headers'
import {redirect} from 'next/navigation'
import {getBackendUrl} from '../../shared'
import {HeaderTop} from '../../widgets/header'
import {AdminNav} from './AdminNav'
import {StaffSessionProvider} from './StaffSessionContext'

const STAFF_TOKEN_COOKIE = 'kong_staff_token'

type StaffMeJson = {
	staff?: {
		id?: string,
		email?: string | null,
		roleCode?: string | null,
	},
	permissions?: string[],
}

async function loadStaffSession() {
	const staffToken = (await cookies()).get(STAFF_TOKEN_COOKIE)?.value
	if (!staffToken) {
		return null
	}

	const backendUrl = getBackendUrl()
	try {
		const res = await fetch(`${backendUrl}/staff/me`, {
			headers: {Authorization: `Bearer ${staffToken}`},
			cache: 'no-store',
		})
		if (!res.ok) {
			return null
		}

		const data = (await res.json()) as StaffMeJson

		const id = data.staff?.id

		return {
			actorId: typeof id === 'string' && id.length > 0
				? id
				: null,
			email: data.staff?.email ?? null,
			role: data.staff?.roleCode ?? null,
			permissions: data.permissions ?? [],
		}
	}
	catch {
		return null
	}
}

export default async function AdminLayout({
	children,
}: Readonly<{children: React.ReactNode}>) {
	const session = await loadStaffSession()
	if (!session) {
		redirect('/account/login')
	}

	return (
		<StaffSessionProvider session={session}>
			<header className="sticky top-0 z-50 bg-white shadow-md">
				<HeaderTop />
			</header>
			<div className="flex flex-1 min-h-0">
				<aside className="hidden md:block">
					<AdminNav />
				</aside>
				<main className="flex-1 overflow-auto p-10">
					{children}
				</main>
			</div>
		</StaffSessionProvider>
	)
}
