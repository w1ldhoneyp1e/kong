import {buildCategoryTree, categoriesApi} from '../entities/category'
import {BentoBanner} from '../shared'
import {CategoryNav} from '../widgets/category-nav'

async function Home() {
	const categories = await categoriesApi.getAll().catch(() => [])
	const tree = buildCategoryTree(categories)

	return (
		<div className="container mx-auto px-6 lg:px-8 max-w-6xl">
			<div className="flex gap-10 py-8">
				<aside className="w-52 flex-shrink-0">
					<CategoryNav tree={tree} />
				</aside>
				<main className="flex-1 min-w-0">
					<BentoBanner />
				</main>
			</div>
		</div>
	)
}

export {Home as default}
