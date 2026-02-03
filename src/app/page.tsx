import Link from 'next/link'
import {categoriesApi} from '../entities/category'
import {BentoBanner} from '../shared'

async function Home() {
	const categories = await categoriesApi.getAll().catch(() => [])

	return (
		<div>
			<BentoBanner />
			<div className="container mx-auto px-4 py-8">
				<nav className="flex flex-wrap gap-4 gap-y-2">
					{categories.length > 0
						? categories.map(cat => (
							<Link
								key={cat.id}
								href={`/catalog/${cat.slug}`}
								className="text-muted-foreground hover:text-foreground"
							>
								{cat.name}
							</Link>
							))
						: (
							<Link
								href="/products"
								className="text-muted-foreground hover:text-foreground"
							>
								{'Все товары'}
							</Link>
							)}
				</nav>
			</div>
		</div>
	)
}

export {Home as default}
