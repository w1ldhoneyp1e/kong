'use client'

import {useSearchParams} from 'next/navigation'
import {
	Suspense,
	useCallback,
	useEffect,
	useState,
} from 'react'
import {type MedusaProduct, listProducts} from '../../../entities/product'
import {SearchHits} from '../../../features/search'

function SearchPageContent() {
	const searchParams = useSearchParams()
	const q = searchParams.get('q') ?? ''
	const [products, setProducts] = useState<MedusaProduct[]>([])
	const [loading, setLoading] = useState(true)

	const load = useCallback(async () => {
		setLoading(true)
		try {
			const {products: list} = await listProducts({
				q: q.trim() || undefined,
				limit: 50,
			})
			setProducts(list)
		}
		catch {
			setProducts([])
		}
		finally {
			setLoading(false)
		}
	}, [q])

	useEffect(() => {
		load()
	}, [load])

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-2xl font-semibold mb-4">
				{q.trim()
					? `Поиск: ${q}`
					: 'Поиск'}
			</h1>
			{loading
				? (
					<p className="text-gray-600">{'Загрузка...'}</p>
				)
				: (
					<SearchHits products={products} />
				)}
		</div>
	)
}

function SearchPage() {
	return (
		<Suspense fallback={<p className="container mx-auto px-4 py-8 text-gray-600">{'Загрузка...'}</p>}>
			<SearchPageContent />
		</Suspense>
	)
}

export {SearchPage as default}
