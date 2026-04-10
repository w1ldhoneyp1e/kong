'use client'

import {X} from 'lucide-react'
import {type ReactNode, useId} from 'react'
import {type ButtonState, Button} from './button'
import {Modal} from './modal'

type PopupProps = Readonly<{
	title: string,
	onClose: () => void,
	onSubmit: () => void,
	submitBtn: {
		label: string,
		onClick: () => void,
		state?: ButtonState,
	},
	className?: string,
	children: ReactNode,
	disabled?: boolean,
}>

function Popup({
	title,
	onClose,
	onSubmit,
	submitBtn,
	className,
	children,
	disabled = false,
}: Readonly<PopupProps>) {
	const titleId = useId()
	const submitBtnDisabled
		= disabled
		|| submitBtn.state === 'disabled'
		|| submitBtn.state === 'loading'

	return (
		<Modal
			onClose={onClose}
			disabled={disabled}
			className={className}
			ariaLabelledBy={titleId}
		>
			<div className="mb-4 flex items-center justify-between gap-2">
				<h3
					id={titleId}
					className="text-lg font-semibold"
				>
					{title}
				</h3>
				<Button
					type="button"
					variant="ghost"
					size="icon-sm"
					disabled={disabled}
					aria-label="Закрыть"
					onClick={onClose}
				>
					<X className="size-5" />
				</Button>
			</div>
			<div>
				{children}
			</div>
			<div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
				<Button
					type="button"
					variant="outline"
					disabled={disabled}
					onClick={onClose}
				>
					{'Отмена'}
				</Button>
				<Button
					type="button"
					state={submitBtn.state}
					disabled={submitBtnDisabled}
					onClick={onSubmit}
				>
					{submitBtn.label}
				</Button>
			</div>
		</Modal>
	)
}

export {Popup}
export type {PopupProps}
