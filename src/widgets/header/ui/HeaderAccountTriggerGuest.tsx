'use client'

import {LogIn} from 'lucide-react'
import {type RefObject} from 'react'
import {Button} from '../../../shared'

type Props = {
	triggerRef: RefObject<HTMLDivElement | null>,
	onMouseEnter: () => void,
	onMouseLeave: () => void,
	onToggle: () => void,
}

function HeaderAccountTriggerGuest({
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
				title="Вход"
				type="button"
				onClick={onToggle}
			>
				<LogIn className="h-5 w-5" />
			</Button>
		</div>
	)
}

export {HeaderAccountTriggerGuest}
