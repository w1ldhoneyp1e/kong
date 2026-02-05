import Link from 'next/link'
import {categoriesApi} from '../../../../entities/category'
import {ProductCard} from '../../../../entities/product'

type PageProps = {
	params: Promise<{
		category: string,
	}>,
}

async function CatalogPage({params}: PageProps) {
	const {category: categorySlug} = await params
	const categories = await categoriesApi.getAll().catch(() => [])
	const currentCategory = categories.find(c => c.slug === categorySlug)

	const mockProducts = [
		{
			url: '/product/classic-shirt',
			image: undefined,
			tags: [{
				label: 'New',
				theme: 'popular' as const,
			}],
			label: 'Spring Collection',
			title: 'Классическая рубашка',
			description: 'Стильная рубашка из 100% хлопка для повседневной носки',
			colors: ['#ffffff', '#000000', '#5468ff'],
			price: 2990,
			originalPrice: 3990,
			currency: {
				symbol: '₽',
				position: 'suffix' as const,
			},
			rating: 4,
			reviews: 12,
			available: true,
		},
		{
			url: '/product/slim-jeans',
			image: undefined,
			tags: [{
				label: 'Sale',
				theme: 'on-sale' as const,
			}],
			label: 'Denim Collection',
			title: 'Джинсы slim fit',
			description: 'Удобные джинсы для повседневной носки из премиального денима',
			colors: ['#1e3a8a', '#475569', '#000000'],
			price: 3990,
			originalPrice: 5990,
			currency: {
				symbol: '₽',
				position: 'suffix' as const,
			},
			rating: 5,
			reviews: 28,
			available: true,
		},
		{
			url: '/product/sport-sneakers',
			image: undefined,
			tags: [{
				label: 'Popular',
				theme: 'popular' as const,
			}],
			label: 'Sport Line',
			title: 'Спортивные кроссовки',
			description: 'Легкие и удобные кроссовки для активного образа жизни',
			colors: ['#ffffff', '#000000', '#ef4444', '#3b82f6'],
			price: 5990,
			currency: {
				symbol: '₽',
				position: 'suffix' as const,
			},
			rating: 4,
			reviews: 45,
			available: true,
		},
		{
			url: '/product/leather-bag',
			image: undefined,
			tags: [{
				label: 'Eco',
				theme: 'eco' as const,
			}],
			label: 'Accessories',
			title: 'Кожаная сумка',
			description: 'Элегантная сумка из натуральной кожи',
			colors: ['#92400e', '#000000'],
			price: 8990,
			currency: {
				symbol: '₽',
				position: 'suffix' as const,
			},
			rating: 5,
			reviews: 18,
			available: true,
		},
	]

	return (
		<div className="container mx-auto px-4 py-8 lg:py-10">
			{categories.length > 0 && (
				<nav className="flex flex-wrap gap-4 gap-y-2 mb-6 lg:mb-10">
					{categories.map(cat => (
						<Link
							key={cat.id}
							href={`/catalog/${cat.slug}`}
							className={cat.slug === categorySlug
								? 'text-foreground font-medium'
								: 'text-muted-foreground hover:text-foreground'}
						>
							{cat.name}
						</Link>
					))}
				</nav>
			)}
			<div className="mb-6 lg:mb-10">
				<h1 className="heading-2">
					{currentCategory?.name ?? categorySlug}
				</h1>
				<p
					className="small-regular mt-2"
					style={{color: 'var(--color-neutral-dark)'}}
				>
					{'Найдено товаров: '}{mockProducts.length}
				</p>
			</div>
			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 lg:gap-4">
				{mockProducts.map(product => (
					<ProductCard
						key={product.url}
						{...product}
						view="grid"
					/>
				))}
			</div>
		</div>
	)
}

export {CatalogPage as default}
