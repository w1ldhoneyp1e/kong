'use client'

type SearchProviderProps = {
	children: React.ReactNode,
}

function SearchProvider({children}: SearchProviderProps) {
	return <>{children}</>
}

export {SearchProvider}
