import {type Metadata} from 'next'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import {categoriesApi} from '../../../../entities/category'
import {
	listProducts,
	mapStoreProductToCardProps,
	ProductCard,
} from '../../../../entities/product'

type PageProps = {
	params: Promise<{
		category: string,
	}>,
	searchParams?: Promise<{
		page?: string,
		sort?: 'created_at' | 'title',
	}>,
}

const PER_PAGE = 12

async function generateMetadata({params}: PageProps): Promise<Metadata> {
	const {category: categorySlug} = await params
	const categories = await categoriesApi.getAll().catch(() => [])
	const currentCategory = categories.find(c => c.slug === categorySlug)

	return {
		title: currentCategory?.name ?? 'Каталог',
		description: `Категория ${currentCategory?.name ?? categorySlug}`,
	}
}

async function CatalogPage({params, searchParams}: PageProps) {
	const {category: categorySlug} = await params
	const query = searchParams
		? await searchParams
		: {}
	const page = Math.max(1, Number(query.page ?? '1') || 1)
	const offset = (page - 1) * PER_PAGE
	const sort = query.sort === 'title'
		? 'title'
		: 'created_at'
	const categories = await categoriesApi.getAll().catch(() => [])
	const currentCategory = categories.find(c => c.slug === categorySlug)
	if (!currentCategory) {
		notFound()
	}
	const productsResponse = await listProducts({
		categoryId: currentCategory.id,
		limit: PER_PAGE,
		offset,
		order: sort,
	}).catch(() => ({
		products: [],
		count: 0,
	}))
	const totalPages = Math.max(1, Math.ceil(productsResponse.count / PER_PAGE))

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
					{currentCategory.name}
				</h1>
				<p
					className="small-regular mt-2"
					style={{color: 'var(--color-neutral-dark)'}}
				>
					{'Найдено товаров: '}{productsResponse.count}
				</p>
			</div>
			<div className="mb-5 flex items-center gap-3 text-sm">
				<Link href={`/catalog/${categorySlug}?sort=created_at&page=1`}>{'Сначала новые'}</Link>
				<Link href={`/catalog/${categorySlug}?sort=title&page=1`}>{'По названию'}</Link>
			</div>
			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 lg:gap-4">
				{productsResponse.products.map(product => (
					<ProductCard
						key={product.id}
						{...mapStoreProductToCardProps(product)}
						view="grid"
					/>
				))}
			</div>
			<div className="mt-8 flex items-center gap-4 text-sm">
				{page > 1 && (
					<Link href={`/catalog/${categorySlug}?sort=${sort}&page=${page - 1}`}>{'Назад'}</Link>
				)}
				<span>{`Страница ${page} из ${totalPages}`}</span>
				{page < totalPages && (
					<Link href={`/catalog/${categorySlug}?sort=${sort}&page=${page + 1}`}>{'Вперед'}</Link>
				)}
			</div>
		</div>
	)
}

export {CatalogPage as default, generateMetadata}
