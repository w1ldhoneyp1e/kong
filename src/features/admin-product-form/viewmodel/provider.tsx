'use client'

import {
	type ReactNode,
	createContext,
	useContext,
} from 'react'
import {type AdminProductFormViewmodel} from './interface'

const AdminProductFormViewmodelContext = createContext<AdminProductFormViewmodel | null>(null)

function AdminProductFormViewmodelProvider({
	children,
	viewmodel,
}: Readonly<{
	children: ReactNode,
	viewmodel: AdminProductFormViewmodel,
}>) {
	return (
		<AdminProductFormViewmodelContext.Provider value={viewmodel}>
			{children}
		</AdminProductFormViewmodelContext.Provider>
	)
}

function useAdminProductFormViewmodel() {
	const vm = useContext(AdminProductFormViewmodelContext)
	if (!vm) {
		throw new Error('useAdminProductFormViewmodel must be used within AdminProductFormViewmodelProvider')
	}

	return vm
}

export {
	AdminProductFormViewmodelProvider,
	useAdminProductFormViewmodel,
}
