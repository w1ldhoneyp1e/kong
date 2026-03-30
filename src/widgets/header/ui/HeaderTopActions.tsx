'use client'

import {Heart, ShoppingCart} from 'lucide-react'
import {type ReactNode} from 'react'
import {Button, Link} from '../../../shared'

function HeaderTopActions({accountSlot}: {accountSlot: ReactNode}) {
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
				>
					<ShoppingCart className="h-5 w-5" />
				</Button>
			</Link>
			{accountSlot}
		</div>
	)
}

export {HeaderTopActions}
