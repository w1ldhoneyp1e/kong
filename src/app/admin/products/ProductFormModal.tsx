'use client'

import {useEffect, useState} from 'react'
import {
	Button,
	FormField,
	Input,
} from '../../../shared'

const STATUS_OPTIONS = [
	{
		value: 'draft',
		label: 'Черновик',
	},
	{
		value: 'proposed',
		label: 'На модерации',
	},
	{
		value: 'published',
		label: 'Опубликован',
	},
	{
		value: 'rejected',
		label: 'Отклонён',
	},
]

function ProductFormModal({
	open,
	title,
	submitLabel = 'Сохранить',
	onOpenChange,
	onSubmit,
	submitting,
	errorText,
	initialTitle = '',
	initialHandle = '',
	initialStatus = 'draft',
}: Readonly<{
	open: boolean,
	title: string,
	submitLabel?: string,
	onOpenChange: (open: boolean) => void,
	onSubmit: (payload: {
		title: string,
		handle: string,
		status: string,
	}) => void,
	submitting: boolean,
	errorText: string,
	initialTitle?: string,
	initialHandle?: string,
	initialStatus?: string,
}>) {
	const [formTitle, setFormTitle] = useState(initialTitle)
	const [formHandle, setFormHandle] = useState(initialHandle)
	const [formStatus, setFormStatus] = useState(initialStatus)

	useEffect(() => {
		if (!open) {
			return
		}

		setFormTitle(initialTitle)
		setFormHandle(initialHandle)
		setFormStatus(initialStatus)
	}, [open, initialTitle, initialHandle, initialStatus])

	if (!open) {
		return null
	}

	const handleBackdropClick = () => {
		if (!submitting) {
			onOpenChange(false)
		}
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		onSubmit({
			title: formTitle.trim(),
			handle: formHandle.trim(),
			status: formStatus,
		})
	}

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			<button
				type="button"
				className="absolute inset-0 bg-black/50"
				aria-label="Закрыть"
				onClick={handleBackdropClick}
			/>
			<div
				className="relative z-10 w-full max-w-md rounded-lg border border-border bg-background p-6 shadow-lg"
				role="dialog"
				aria-modal="true"
				aria-labelledby="product-form-title"
			>
				<h2
					id="product-form-title"
					className="mb-4 text-lg font-semibold"
				>
					{title}
				</h2>
				<form
					className="space-y-4"
					onSubmit={handleSubmit}
				>
					<FormField
						label="Название"
						htmlFor="product-title"
					>
						<Input
							id="product-title"
							value={formTitle}
							onChange={e => {
								setFormTitle(e.target.value)
							}}
							required={true}
							disabled={submitting}
						/>
					</FormField>
					<FormField
						label="Handle (URL)"
						htmlFor="product-handle"
					>
						<Input
							id="product-handle"
							value={formHandle}
							onChange={e => {
								setFormHandle(e.target.value)
							}}
							disabled={submitting}
						/>
					</FormField>
					<FormField
						label="Статус"
						htmlFor="product-status"
					>
						<select
							id="product-status"
							className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
							value={formStatus}
							onChange={e => {
								setFormStatus(e.target.value)
							}}
							disabled={submitting}
						>
							{STATUS_OPTIONS.map(opt => (
								<option
									key={opt.value}
									value={opt.value}
								>
									{opt.label}
								</option>
							))}
						</select>
					</FormField>
					{errorText
						? (
							<p
								className="text-sm text-destructive"
								role="alert"
							>
								{errorText}
							</p>
						)
						: null}
					<div className="flex justify-end gap-2 pt-2">
						<Button
							type="button"
							variant="outline"
							disabled={submitting}
							onClick={() => {
								onOpenChange(false)
							}}
						>
							{'Отмена'}
						</Button>
						<Button
							type="submit"
							state={submitting
								? 'loading'
								: 'default'}
						>
							{submitLabel}
						</Button>
					</div>
				</form>
			</div>
		</div>
	)
}

export {ProductFormModal}
