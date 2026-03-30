'use client'

import {User} from 'lucide-react'
import {type RefObject} from 'react'
import {Button} from '../../../shared'

type Props = {
	triggerRef: RefObject<HTMLDivElement | null>,
	onMouseEnter: () => void,
	onMouseLeave: () => void,
	onToggle: () => void,
}

function HeaderAccountTriggerAuth({
	triggerRef,
	onMouseEnter,
	onMouseLeave,
	onToggle,
}: Props) {
	return (
		<div
			className="relative shrink-0"
			ref={triggerRef}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
		>
			<Button
				variant="ghost"
				size="icon"
				title="Аккаунт"
				type="button"
				onClick={onToggle}
			>
				<User className="h-5 w-5" />
			</Button>
		</div>
	)
}

export {HeaderAccountTriggerAuth}
