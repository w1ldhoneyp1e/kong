'use client'

import {Heart, ShoppingCart} from 'lucide-react'
import {type ReactNode} from 'react'
import {useCartCount} from '../../../features/cart'
import {Button, Link} from '../../../shared'

function HeaderTopActions({accountSlot}: {accountSlot: ReactNode}) {
	const cartCount = useCartCount()

	return (
		<div className="flex items-center gap-4">
			<Button
				variant="ghost"
				size="icon"
				title="Избранное"
				type="button"
			>
				<Heart className="h-5 w-5" />
			</Button>
			<Link href="/cart">
				<Button
					variant="ghost"
					size="icon"
					title="Корзина"
					type="button"
					className="relative"
				>
					<ShoppingCart className="h-5 w-5" />
					{cartCount > 0
						? (
							<span className="absolute -right-1 -top-1 flex min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-semibold leading-5 text-primary-foreground">
								{cartCount > 99
									? '99+'
									: cartCount}
							</span>
						)
						: null}
				</Button>
			</Link>
			{accountSlot}
		</div>
	)
}

export {HeaderTopActions}
