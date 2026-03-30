'use client'

import {usePathname} from 'next/navigation'
import {useMemo} from 'react'
import {cn, Link} from '../../shared'
import {adminNavItems} from './consts'
import {useStaffSession} from './StaffSessionContext'

function AdminNav() {
	const pathname = usePathname()
	const {permissions} = useStaffSession()

	const visibleItems = useMemo(
		() => adminNavItems.filter(item => {
			const key = item.requiredPermission
			if (!key) {
				return true
			}

			return permissions.includes(key)
		}),
		[permissions],
	)

	return (
		<nav className="sticky top-0 flex h-[calc(100vh-0px)] flex-col gap-4 py-4 gap-1 border-r border-border bg-muted/30 min-w-[200px] p-3">
			{visibleItems.map(item => (
				<Link
					key={item.id}
					href={item.href}
					className={cn(
						'rounded-md px-3 py-2 text-sm font-medium',
						pathname === item.href
							? 'bg-background text-foreground shadow-sm'
							: 'text-muted-foreground hover:bg-background/50 hover:text-foreground',
					)}
				>
					{item.label}
				</Link>
			))}
		</nav>
	)
}

export {
	AdminNav,
}
