'use client'

import {useRouter} from 'next/navigation'
import {useEffect} from 'react'
import {useStaffSession} from '../StaffSessionContext'

export default function StaffLayout({
	children,
}: Readonly<{children: React.ReactNode}>) {
	const {permissions} = useStaffSession()
	const router = useRouter()
	const allowed = permissions.includes('staff:manage')

	useEffect(() => {
		if (!allowed) {
			router.replace('/admin/categories')
		}
	}, [allowed, router])

	if (!allowed) {
		return (
			<p className="text-muted-foreground">
				{'Нет доступа'}
			</p>
		)
	}

	return children
}
