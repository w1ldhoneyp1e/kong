'use client'

import {
	createContext,
	useContext,
	useMemo,
} from 'react'

type StaffSessionValue = {
	email: string | null,
	role: string | null,
	permissions: string[],
}

const StaffSessionContext = createContext<StaffSessionValue | null>(null)

function StaffSessionProvider({
	children,
	session,
}: Readonly<{
	children: React.ReactNode,
	session: StaffSessionValue,
}>) {
	const value = useMemo(() => session, [session])

	return (
		<StaffSessionContext.Provider value={value}>
			{children}
		</StaffSessionContext.Provider>
	)
}

function useStaffSession(): StaffSessionValue {
	const ctx = useContext(StaffSessionContext)
	if (!ctx) {
		throw new Error('useStaffSession вне StaffSessionProvider')
	}

	return ctx
}

export type {StaffSessionValue}
export {
	StaffSessionProvider,
	useStaffSession,
}
