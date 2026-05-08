import {buildCategoryTree, categoriesApi} from '../../entities/category'
import {
	listPopularProducts,
	mapStoreProductToCardProps,
	ProductCard,
} from '../../entities/product'
import {BentoBanner} from '../../shared'
import {CategoryNav} from '../../widgets/category-nav'

async function Home() {
	const categories = await categoriesApi.getAll().catch(() => [])
	const tree = buildCategoryTree(categories)
	const popularProducts = await listPopularProducts(8)
		.then(response => response.products)
		.catch(() => [])

	return (
		<div className="container mx-auto px-6 lg:px-8 max-w-6xl">
			<div className="flex gap-10 py-8">
				<aside className="w-52 shrink-0">
					<CategoryNav tree={tree} />
				</aside>
				<main className="flex-1 min-w-0 space-y-10">
					<BentoBanner />
					<section>
						<div className="mb-5 flex items-end justify-between gap-4">
							<h2 className="heading-4">{'Популярные товары'}</h2>
						</div>
						{popularProducts.length > 0
							? (
								<div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 lg:gap-4">
									{popularProducts.map(product => (
										<ProductCard
											key={product.id}
											{...mapStoreProductToCardProps(product)}
											view="grid"
										/>
									))}
								</div>
							)
							: (
								<div
									className="py-10 text-center small-regular"
									style={{color: 'var(--color-neutral-dark)'}}
								>
									{'В каталоге пока нет опубликованных товаров.'}
								</div>
							)}
					</section>
				</main>
			</div>
		</div>
	)
}

export {Home as default}
