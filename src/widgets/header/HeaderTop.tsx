'use client'

import {usePathname, useRouter} from 'next/navigation'
import {useAccountSession} from './AccountSessionContext'
import {Logo} from './Logo'
import {getHeaderAccountSlot} from './types'
import {HeaderAccountPopoverAuth} from './ui/HeaderAccountPopoverAuth'
import {HeaderAccountPopoverGuest} from './ui/HeaderAccountPopoverGuest'
import {HeaderAccountPopoverPortal} from './ui/HeaderAccountPopoverPortal'
import {HeaderAccountTriggerAuth} from './ui/HeaderAccountTriggerAuth'
import {HeaderAccountTriggerGuest} from './ui/HeaderAccountTriggerGuest'
import {HeaderTopActions} from './ui/HeaderTopActions'
import {useHeaderAccountPopoverVm} from './viewmodel/useHeaderAccountPopoverVm'

function HeaderTop() {
	const router = useRouter()
	const pathname = usePathname()
	const {
		account, isReady, clearSession,
	} = useAccountSession()

	const {
		isMounted,
		isOpen,
		top,
		left,
		triggerRef,
		open,
		closeNow,
		closeDelayed,
		toggle,
	} = useHeaderAccountPopoverVm()

	const slot = getHeaderAccountSlot({
		account,
		isReady,
		pathname,
	})

	const handleLogout = async () => {
		await fetch('/api/account/logout', {method: 'POST'}).catch(() => {})
		closeNow()
		clearSession()
		router.push('/')
		router.refresh()
	}

	const loadingSlot = (
		<div
			className="h-9 w-9 shrink-0 animate-pulse rounded-md bg-muted"
			aria-hidden={true}
		/>
	)

	const accountIconSlot = slot.kind === 'authenticated'
		? (
			<HeaderAccountTriggerAuth
				triggerRef={triggerRef}
				onMouseEnter={open}
				onMouseLeave={closeDelayed}
				onToggle={toggle}
			/>
		)
		: (
			<HeaderAccountTriggerGuest
				triggerRef={triggerRef}
				onMouseEnter={open}
				onMouseLeave={closeDelayed}
				onToggle={toggle}
			/>
		)

	const authSlot = slot.kind === 'loading'
		? loadingSlot
		: accountIconSlot

	const showAccountPortal = isMounted && isOpen && slot.kind === 'authenticated'
	const showGuestPortal = isMounted && isOpen && slot.kind === 'guest'

	return (
		<div className="border-b">
			<div className="container mx-auto px-4 py-4">
				<div className="flex items-center justify-between">
					<Logo />
					<HeaderTopActions accountSlot={authSlot} />
				</div>
			</div>
			<HeaderAccountPopoverPortal
				shouldRender={showAccountPortal}
				top={top}
				left={left}
				onMouseEnter={open}
				onMouseLeave={closeDelayed}
			>
				{slot.kind === 'authenticated' && (
					<HeaderAccountPopoverAuth
						accountLabel={slot.accountLabel}
						roleCode={slot.roleCode}
						isStaff={slot.isStaff}
						portalHref={slot.portalHref}
						portalLabel={slot.portalLabel}
						onClosePortal={closeNow}
						onLogout={handleLogout}
					/>
				)}
			</HeaderAccountPopoverPortal>
			<HeaderAccountPopoverPortal
				shouldRender={showGuestPortal}
				top={top}
				left={left}
				onMouseEnter={open}
				onMouseLeave={closeDelayed}
			>
				<HeaderAccountPopoverGuest onClose={closeNow} />
			</HeaderAccountPopoverPortal>
		</div>
	)
}

export {HeaderTop}
