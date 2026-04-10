'use client'

import * as React from 'react'
import {cn} from '../lib/utils'

type ModalProps = {
	onClose: () => void,
	disabled?: boolean,
	children: React.ReactNode,
	className?: string,
	ariaLabelledBy?: string,
}

function Modal({
	onClose,
	disabled = false,
	children,
	className,
	ariaLabelledBy,
}: Readonly<ModalProps>) {
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			<button
				type="button"
				className="absolute inset-0 bg-black/50"
				aria-label="Закрыть"
				onClick={() => {
					if (!disabled) {
						onClose()
					}
				}}
			/>
			<div
				className={cn(
					'relative z-10 w-full rounded-lg border border-border bg-background p-6 shadow-lg',
					className,
				)}
				role="dialog"
				aria-modal="true"
				aria-labelledby={ariaLabelledBy}
			>
				{children}
			</div>
		</div>
	)
}

export {Modal}
