import {cookies} from 'next/headers'
import {redirect} from 'next/navigation'
import {getBackendUrl} from '../../shared'
import {HeaderTop} from '../../widgets/header'
import {AdminNav} from './AdminNav'

const STAFF_TOKEN_COOKIE = 'kong_staff_token'

async function hasValidStaffSession(): Promise<boolean> {
	const staffToken = (await cookies()).get(STAFF_TOKEN_COOKIE)?.value
	if (!staffToken) {
		return false
	}

	const backendUrl = getBackendUrl()
	try {
		const res = await fetch(`${backendUrl}/staff/me`, {
			headers: {Authorization: `Bearer ${staffToken}`},
			cache: 'no-store',
		})

		return res.ok
	}
	catch {
		return false
	}
}

export default async function AdminLayout({
	children,
}: Readonly<{children: React.ReactNode}>) {
	const isValidStaff = await hasValidStaffSession()
	if (!isValidStaff) {
		redirect('/account/login')
	}

	return (
		<>
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
		</>
	)
}
