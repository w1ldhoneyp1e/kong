'use client'

import {
	Heart,
	ShoppingCart,
	User,
} from 'lucide-react'
import {SearchBox} from '../../features/search'
import {Button, Link} from '../../shared'
import {Logo} from './Logo'

function Header() {
	return (
		<header className="sticky top-0 z-50 bg-white shadow-md">
			<div className="border-b">
				<div className="container mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<Logo />
						<div className="flex items-center gap-4">
							<Button
								variant="ghost"
								size="icon"
								title="Избранное"
							>
								<Heart className="h-5 w-5" />
							</Button>
							<Button
								variant="ghost"
								size="icon"
								title="Аккаунт"
							>
								<User className="h-5 w-5" />
							</Button>
							<Link href="/cart">
								<Button
									variant="ghost"
									size="icon"
									title="Корзина"
								>
									<ShoppingCart className="h-5 w-5" />
								</Button>
							</Link>
						</div>
					</div>
				</div>
			</div>
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
		</header>
	)
}

export {Header}

