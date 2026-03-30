'use client'

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react'

type AccountMe = {
	authenticated: boolean,
	actorType: 'guest' | 'customer' | 'staff',
	email?: string | null,
	roleCode?: string | null,
	permissions?: string[],
}

const guestAccount: AccountMe = {
	authenticated: false,
	actorType: 'guest',
	roleCode: 'guest',
	email: null,
}

type AccountSessionContextValue = {
	account: AccountMe,
	isReady: boolean,
	refreshSession: () => Promise<void>,
	clearSession: () => void,
	hydrateAccount: (next: AccountMe) => void,
}

const AccountSessionContext = createContext<AccountSessionContextValue | null>(null)

function AccountSessionProvider({children}: {children: React.ReactNode}) {
	const [account, setAccount] = useState<AccountMe>(guestAccount)
	const [isReady, setIsReady] = useState(false)

	const loadMe = useCallback(async () => {
		try {
			const res = await fetch('/api/account/me', {credentials: 'same-origin'})
			if (!res.ok) {
				setAccount(guestAccount)

				return
			}

			const data = (await res.json()) as AccountMe
			setAccount(data)
		}
		catch {
			setAccount(guestAccount)
		}
	}, [])

	useEffect(() => {
		let cancelled = false
		;(async () => {
			await loadMe()
			if (!cancelled) {
				setIsReady(true)
			}
		})()

		return () => {
			cancelled = true
		}
	}, [loadMe])

	const refreshSession = useCallback(async () => {
		await loadMe()
	}, [loadMe])

	const clearSession = useCallback(() => {
		setAccount(guestAccount)
	}, [])

	const hydrateAccount = useCallback((next: AccountMe) => {
		setAccount(next)
	}, [])

	const value = useMemo(
		() => ({
			account,
			isReady,
			refreshSession,
			clearSession,
			hydrateAccount,
		}),
		[account, isReady, refreshSession, clearSession, hydrateAccount],
	)

	return (
		<AccountSessionContext.Provider value={value}>
			{children}
		</AccountSessionContext.Provider>
	)
}

function useAccountSession(): AccountSessionContextValue {
	const ctx = useContext(AccountSessionContext)
	if (!ctx) {
		throw new Error('useAccountSession вне AccountSessionProvider')
	}

	return ctx
}

export type {AccountMe}
export {
	AccountSessionProvider,
	useAccountSession,
}
