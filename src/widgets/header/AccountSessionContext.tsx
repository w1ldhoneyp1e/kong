'use client'

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react'
import {type AccountMe} from '../../app/api/account/_lib/accountMeTypes'

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

	const hydrateSeqRef = useRef(0)
	const lastHydrateAtRef = useRef(0)

	const fetchMe = useCallback(async (): Promise<AccountMe> => {
		try {
			const res = await fetch('/api/account/me', {credentials: 'same-origin'})
			if (!res.ok) {
				return guestAccount
			}

			const data = await res.json().catch(() => ({})) as {
				ok?: boolean,
				account?: AccountMe,
			}
			if (data.ok === true && data.account) {
				return data.account
			}

			return guestAccount
		}
		catch {
			return guestAccount
		}
	}, [])

	const loadMe = useCallback(async () => {
		const seqAtStart = hydrateSeqRef.current
		const data = await fetchMe()
		if (seqAtStart !== hydrateSeqRef.current) {
			return
		}

		setAccount(data)
	}, [fetchMe])

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
		const wasAuthenticated = account.authenticated === true
		const hydrateAgeMs = Date.now() - lastHydrateAtRef.current
		const seqAtStart = hydrateSeqRef.current

		if (wasAuthenticated && hydrateAgeMs < 1000) {
			for (let i = 0; i < 3; i++) {
				const data = await fetchMe()
				if (seqAtStart !== hydrateSeqRef.current) {
					return
				}

				if (data.authenticated) {
					setAccount(data)
					setIsReady(true)
					return
				}

				if (i < 2) {
					await new Promise<void>(r => {
						setTimeout(r, 150)
					})
				}
				else {
					setAccount(data)
					setIsReady(true)
				}
			}

			return
		}

		await loadMe()
		setIsReady(true)
	}, [account.authenticated, fetchMe, loadMe])

	const clearSession = useCallback(() => {
		hydrateSeqRef.current += 1
		lastHydrateAtRef.current = Date.now()
		setAccount(guestAccount)
		setIsReady(true)
	}, [])

	const hydrateAccount = useCallback((next: AccountMe) => {
		hydrateSeqRef.current += 1
		lastHydrateAtRef.current = Date.now()
		setAccount(next)
		setIsReady(true)
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
