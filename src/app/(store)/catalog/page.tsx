import {categoriesApi} from '../../../entities/category'
import {Link} from '../../../shared'

async function CatalogRootPage() {
	const categories = await categoriesApi.getAll().catch(() => [])

	return (
		<div className="container mx-auto px-4 py-10 lg:py-14">
			<h1 className="text-3xl font-semibold">{'Каталог'}</h1>
			<div className="mt-6 flex flex-wrap gap-4">
				{categories.map(category => (
					<Link
						key={category.id}
						href={`/catalog/${category.slug}`}
						className="underline-offset-4 hover:underline"
					>
						{category.name}
					</Link>
				))}
			</div>
		</div>
	)
}

export {CatalogRootPage as default}
