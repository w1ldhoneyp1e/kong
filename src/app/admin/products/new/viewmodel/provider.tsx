'use client'

import {
	type ReactNode,
	createContext,
	useContext,
} from 'react'
import {type ProductCreateVm} from './interface'

const ProductCreateVmContext = createContext<ProductCreateVm | null>(null)

function ProductCreateVmProvider({
	children,
	vm,
}: Readonly<{
	children: ReactNode,
	vm: ProductCreateVm,
}>) {
	return (
		<ProductCreateVmContext.Provider value={vm}>
			{children}
		</ProductCreateVmContext.Provider>
	)
}

function useProductCreateVm() {
	const vm = useContext(ProductCreateVmContext)
	if (!vm) {
		throw new Error('useProductCreateVm must be used within ProductCreateVmProvider')
	}

	return vm
}

export {
	ProductCreateVmProvider,
	useProductCreateVm,
}
