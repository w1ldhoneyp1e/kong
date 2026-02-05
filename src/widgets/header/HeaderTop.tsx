import {Heart, ShoppingCart, User} from 'lucide-react'
import {Button, Link} from '../../shared'
import {Logo} from './Logo'

function HeaderTop() {
	return (
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
	)
}

export {HeaderTop}
