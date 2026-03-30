'use client'

import {Link} from '../../../shared'

type Props = {
	onClose: () => void,
}

function HeaderAccountPopoverGuest({onClose}: Props) {
	return (
		<div className="rounded-md border bg-white shadow-lg p-1">
			<Link
				href="/account/login"
				className="block px-3 py-2 rounded-md text-sm hover:bg-muted"
				onClick={onClose}
			>
				{'Войти'}
			</Link>
			<Link
				href="/account/register"
				className="block px-3 py-2 rounded-md text-sm hover:bg-muted"
				onClick={onClose}
			>
				{'Зарегистрироваться'}
			</Link>
		</div>
	)
}

export {HeaderAccountPopoverGuest}
