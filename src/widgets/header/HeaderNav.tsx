'use client'

import {SearchBox} from '../../features/search'
import {Link} from '../../shared'

function HeaderNav() {
	return (
		<div className="border-b">
			<div className="container mx-auto px-4 py-3">
				<div className="flex items-center justify-between gap-6">
					<nav className="flex gap-6">
						<Link
							href="/"
							className="text-sm font-medium uppercase hover:text-gray-600 transition-colors"
						>
							{'Главная'}
						</Link>
						<Link
							href="/about"
							className="text-sm font-medium uppercase hover:text-gray-600 transition-colors"
						>
							{'О нас'}
						</Link>
						<Link
							href="/catalog"
							className="text-sm font-medium uppercase hover:text-gray-600 transition-colors"
						>
							{'Каталог'}
						</Link>
						<Link
							href="/contacts"
							className="text-sm font-medium uppercase hover:text-gray-600 transition-colors"
						>
							{'Контакты'}
						</Link>
					</nav>
					<div className="flex-1 max-w-md">
						<SearchBox />
					</div>
				</div>
			</div>
		</div>
	)
}

export {HeaderNav}
