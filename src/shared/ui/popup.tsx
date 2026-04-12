'use client'

import {X} from 'lucide-react'
import {type ReactNode, useId} from 'react'
import {cn} from '../lib/utils'
import {type ButtonState, Button} from './button'
import {Modal} from './modal'

type PopupProps = Readonly<{
	title: string,
	onClose: () => void,
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
			className={cn(
				'flex max-h-[min(90vh,36rem)] flex-col overflow-hidden p-0',
				className,
			)}
			ariaLabelledBy={titleId}
		>
			<div className="flex min-h-0 flex-1 flex-col">
				<div className="flex shrink-0 items-center justify-between gap-2 border-b border-border px-6 pb-4 pt-4">
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
				<div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
					{children}
				</div>
				<div className="flex shrink-0 flex-col-reverse gap-2 border-t border-border px-6 pb-4 pt-4 sm:flex-row sm:justify-end">
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
						onClick={submitBtn.onClick}
					>
						{submitBtn.label}
					</Button>
				</div>
			</div>
		</Modal>
	)
}

export {Popup}
export type {PopupProps}
