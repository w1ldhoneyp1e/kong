'use client'

import {useSearchParams} from 'next/navigation'
import {
	Suspense,
	useEffect,
	useState,
} from 'react'
import {Link} from '../../../shared'
import {
	getProductByHandle,
	mapStoreProductToCardProps,
	ProductCard,
	type StoreProduct,
} from '../../../entities/product'
import {type StoreSettings} from '../../../entities/store'
import {type SearchResponse, type SearchResultItem} from '../../../features/search'

function SearchPageContent() {
	const searchParams = useSearchParams()
	const q = searchParams.get('q') ?? ''
	const [results, setResults] = useState<SearchResultItem[]>([])
	const [productsByHref, setProductsByHref] = useState<Record<string, StoreProduct>>({})
	const [store, setStore] = useState<StoreSettings | null>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		if (!q.trim()) {
			setResults([])
			setProductsByHref({})
			setLoading(false)
			return
		}

		setLoading(true)
		fetch(`/api/search?q=${encodeURIComponent(q)}&limit=40`)
			.then(res => res.json().catch(() => ({results: []})))
			.then(async (data: SearchResponse) => {
				const nextResults = data.results ?? []
				setResults(nextResults)

				const productResults = nextResults.filter(item => item.type === 'product')
				const nextProducts: Record<string, StoreProduct> = {}
				await Promise.all(productResults.map(async item => {
					const handle = item.href.startsWith('/product/')
						? item.href.replace('/product/', '')
						: null
					if (!handle) {
						return
					}

					const product = await getProductByHandle(handle).catch(() => null)
					if (product) {
						nextProducts[item.href] = product
					}
				}))
				setProductsByHref(nextProducts)
			})
			.catch(() => {
				setResults([])
				setProductsByHref({})
			})
			.finally(() => {
				setLoading(false)
			})
	}, [q])

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

	const pages = results.filter(item => item.type === 'page')
	const categories = results.filter(item => item.type === 'category')
	const products = results.filter(item => item.type === 'product')
	const showPrice = store?.commerce_enabled ?? true

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="mb-2 text-2xl font-semibold">
				{q.trim()
					? `Поиск: ${q}`
					: 'Поиск'}
			</h1>
			<p className="mb-6 text-sm text-muted-foreground">
				{q.trim()
					? `Найдено результатов: ${results.length}`
					: 'Введите запрос, чтобы найти товары, категории и страницы сайта.'}
			</p>
			{loading
				? (
					<p className="text-gray-600">{'Загрузка...'}</p>
				)
				: (
					<div className="space-y-8">
						{pages.length > 0 && (
							<section>
								<h2 className="mb-3 text-lg font-semibold">{'Страницы'}</h2>
								<div className="space-y-3">
									{pages.map(page => (
										<Link
											key={`${page.type}-${page.id}`}
											href={page.href}
											className="block rounded-md border p-4 hover:bg-muted/20"
										>
											<div className="font-medium">{page.title}</div>
											{page.description
												? <div className="mt-1 text-sm text-muted-foreground">{page.description}</div>
												: null}
										</Link>
									))}
								</div>
							</section>
						)}

						{categories.length > 0 && (
							<section>
								<h2 className="mb-3 text-lg font-semibold">{'Категории'}</h2>
								<div className="flex flex-wrap gap-3">
									{categories.map(category => (
										<Link
											key={`${category.type}-${category.id}`}
											href={category.href}
											className="rounded-md border px-4 py-2 text-sm hover:bg-muted/20"
										>
											{category.title}
										</Link>
									))}
								</div>
							</section>
						)}

						{products.length > 0 && (
							<section>
								<h2 className="mb-3 text-lg font-semibold">{'Товары'}</h2>
								<div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
									{products.map(productResult => {
										const product = productsByHref[productResult.href]
										if (!product) {
											return null
										}

										return (
											<ProductCard
												key={`${productResult.type}-${productResult.id}`}
												{...mapStoreProductToCardProps(product, {showPrice})}
											/>
										)
									})}
								</div>
							</section>
						)}

						{results.length === 0 && (
							<div className="py-12 text-center">
								<p className="text-gray-600">{'Ничего не найдено. Попробуйте изменить запрос.'}</p>
							</div>
						)}
					</div>
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
