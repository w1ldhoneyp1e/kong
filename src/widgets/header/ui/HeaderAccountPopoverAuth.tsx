'use client'

import {Button, Link} from '../../../shared'

type Props = {
	accountLabel: string,
	roleCode: string | null,
	isStaff: boolean,
	portalHref: string,
	portalLabel: string,
	onClosePortal: () => void,
	onLogout: () => void,
}

function HeaderAccountPopoverAuth({
	accountLabel,
	roleCode,
	isStaff,
	portalHref,
	portalLabel,
	onClosePortal,
	onLogout,
}: Props) {
	return (
		<div className="rounded-md border bg-white shadow-lg p-2 space-y-1">
			<div className="px-3 py-2">
				<p className="text-xs text-muted-foreground">
					{'Вы вошли как'}
				</p>
				<p className="text-sm font-medium break-all">
					{accountLabel}
				</p>
				<p className="text-xs text-muted-foreground mt-1">
					{roleCode ?? 'user'}
				</p>
			</div>
			{isStaff && (
				<div className="pt-2 border-t mt-2">
					<Link
						href={portalHref}
						className="block px-3 py-2 rounded-md text-sm hover:bg-muted"
						onClick={onClosePortal}
					>
						{portalLabel}
					</Link>
				</div>
			)}
			<div className="pt-2 border-t mt-2">
				<Button
					type="button"
					variant="ghost"
					className="w-full justify-start"
					onClick={onLogout}
				>
					{'Выйти'}
				</Button>
			</div>
		</div>
	)
}

export {HeaderAccountPopoverAuth}
