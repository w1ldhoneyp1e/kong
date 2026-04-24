import {type AccountMe} from './AccountSessionContext'

type HeaderAccountSlotLoading = {
	kind: 'loading',
}

type HeaderAccountSlotGuest = {
	kind: 'guest',
}

type HeaderAccountSlotAuthenticated = {
	kind: 'authenticated',
	accountLabel: string,
	roleCode: string | null,
	isStaff: boolean,
	portalHref: string,
	portalLabel: string,
}

type HeaderAccountSlot = HeaderAccountSlotLoading | HeaderAccountSlotGuest | HeaderAccountSlotAuthenticated

function derivePortalHrefAndLabel(pathname: string, roleCode: string | null): {
	portalHref: string,
	portalLabel: string,
} {
	if (roleCode === 'customer') {
		return {
			portalHref: '/account/profile',
			portalLabel: 'Профиль',
		}
	}

	const isInAdmin = pathname.startsWith('/admin')
	if (isInAdmin) {
		return {
			portalHref: '/',
			portalLabel: 'В магазин',
		}
	}

	const isAdminPortal = roleCode === 'admin' || roleCode === 'owner'
	return {
		portalHref: '/admin',
		portalLabel: isAdminPortal
			? 'В портал администратора'
			: 'В портал менеджера',
	}
}

function deriveIsStaff(roleCode: string | null): boolean {
	const isAdminPortal = roleCode === 'admin' || roleCode === 'owner'
	const isManagerPortal = roleCode === 'manager'

	return isAdminPortal || isManagerPortal
}

function getHeaderAccountSlot({
	account,
	isReady,
	pathname,
}: {
	account: AccountMe,
	isReady: boolean,
	pathname: string,
}): HeaderAccountSlot {
	if (!isReady) {
		return {kind: 'loading'}
	}

	if (!account.authenticated) {
		return {kind: 'guest'}
	}

	const roleCode = account.roleCode ?? null
	const accountLabel = account.email ?? 'Пользователь'
	const isStaff = deriveIsStaff(roleCode)
	const {portalHref, portalLabel} = derivePortalHrefAndLabel(pathname, roleCode)

	return {
		kind: 'authenticated',
		accountLabel,
		roleCode,
		isStaff,
		portalHref,
		portalLabel,
	}
}

export {
	getHeaderAccountSlot,
	type HeaderAccountSlot,
	type HeaderAccountSlotAuthenticated,
}

