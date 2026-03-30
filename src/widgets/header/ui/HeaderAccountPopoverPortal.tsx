'use client'

import {type ReactNode} from 'react'
import {createPortal} from 'react-dom'

type Props = {
	shouldRender: boolean,
	top: number,
	left: number,
	onMouseEnter: () => void,
	onMouseLeave: () => void,
	children: ReactNode,
}

function HeaderAccountPopoverPortal({
	shouldRender,
	top,
	left,
	onMouseEnter,
	onMouseLeave,
	children,
}: Props) {
	if (!shouldRender) {
		return null
	}

	return createPortal(
		<div
			className="fixed z-[120] w-56"
			style={{
				top,
				left,
			}}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
		>
			{children}
		</div>,
		document.body,
	)
}

export {HeaderAccountPopoverPortal}
