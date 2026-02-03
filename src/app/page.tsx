import Link from 'next/link'
import {categoriesApi} from '../entities/category'
import {BentoBanner} from '../shared'

async function Home() {
	const categories = await categoriesApi.getAll().catch(() => [])

	return (
		<div className="container mx-auto px-6 lg:px-8 max-w-6xl">
			<div className="flex gap-10 py-8">
				<nav className="w-44 flex-shrink-0 flex flex-col gap-3">
					{categories.length > 0
						? categories.map(cat => (
							<Link
								key={cat.id}
								href={`/catalog/${cat.slug}`}
								className="text-muted-foreground hover:text-foreground text-sm"
							>
								{cat.name}
							</Link>
							))
						: (
							<Link
								href="/products"
								className="text-muted-foreground hover:text-foreground text-sm"
							>
								{'Все товары'}
							</Link>
							)}
				</nav>
				<main className="flex-1 min-w-0">
					<BentoBanner />
				</main>
			</div>
		</div>
	)
}

export {Home as default}
