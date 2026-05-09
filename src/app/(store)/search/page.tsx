'use client'

import {useSearchParams} from 'next/navigation'
import {
	Suspense,
	useCallback,
	useEffect,
	useState,
} from 'react'
import {type StoreProduct, listProducts} from '../../../entities/product'
import {type StoreSettings} from '../../../entities/store'
import {SearchHits} from '../../../features/search'

function SearchPageContent() {
	const searchParams = useSearchParams()
	const q = searchParams.get('q') ?? ''
	const [products, setProducts] = useState<StoreProduct[]>([])
	const [store, setStore] = useState<StoreSettings | null>(null)
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

	useEffect(() => {
		fetch('/api/store')
			.then(res => res.json().catch(() => ({})))
			.then((data: {store?: StoreSettings}) => {
				setStore(data.store ?? null)
			})
			.catch(() => {
				setStore(null)
			})
	}, [])

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
					<SearchHits
						products={products}
						showPrice={store?.commerce_enabled ?? true}
					/>
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
