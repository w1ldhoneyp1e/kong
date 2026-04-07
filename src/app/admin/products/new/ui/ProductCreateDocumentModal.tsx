'use client'

import {
	Button,
	FormField,
	Input,
	Modal,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../../../../../shared'
import {type ProductDocumentKind, type ProductDocumentSourceType} from '../types'

function ProductCreateDocumentModal({
	open,
	disabled,
	newDocTitle,
	newDocKind,
	newDocSourceType,
	newDocUrl,
	documentKindOptions,
	documentSourceTypeOptions,
	onOpenChange,
	onNewDocTitleChange,
	onNewDocKindChange,
	onNewDocSourceTypeChange,
	onNewDocUrlChange,
	onConfirm,
}: Readonly<{
	open: boolean,
	disabled: boolean,
	newDocTitle: string,
	newDocKind: ProductDocumentKind,
	newDocSourceType: ProductDocumentSourceType,
	newDocUrl: string,
	documentKindOptions: {
		value: ProductDocumentKind,
		label: string,
	}[],
	documentSourceTypeOptions: {
		value: ProductDocumentSourceType,
		label: string,
	}[],
	onOpenChange: (open: boolean) => void,
	onNewDocTitleChange: (value: string) => void,
	onNewDocKindChange: (value: ProductDocumentKind) => void,
	onNewDocSourceTypeChange: (value: ProductDocumentSourceType) => void,
	onNewDocUrlChange: (value: string) => void,
	onConfirm: () => void,
}>) {
	const canSubmit
		= newDocTitle.trim().length > 0 && newDocUrl.trim().length > 0

	return (
		<Modal
			open={open}
			onOpenChange={onOpenChange}
			disabled={disabled}
			className="max-h-[min(90vh,36rem)] max-w-lg overflow-y-auto"
			ariaLabelledBy="create-document-modal-title"
		>
			<div className="mb-4 flex items-center justify-between gap-2">
				<h3
					id="create-document-modal-title"
					className="text-lg font-semibold"
				>
					{'Новый документ'}
				</h3>
				<Button
					type="button"
					variant="outline"
					size="sm"
					disabled={disabled}
					onClick={() => {
						onOpenChange(false)
					}}
				>
					{'Закрыть'}
				</Button>
			</div>
			<div className="grid gap-4 sm:grid-cols-2">
				<FormField
					className="sm:col-span-2"
					label="Название"
					htmlFor="create-doc-title"
				>
					<Input
						id="create-doc-title"
						value={newDocTitle}
						onChange={event => {
							onNewDocTitleChange(event.target.value)
						}}
						disabled={disabled}
					/>
				</FormField>
				<FormField
					label="Тип"
					htmlFor="create-doc-kind"
				>
					<Select
						value={newDocKind}
						onValueChange={value => {
							onNewDocKindChange(value as ProductDocumentKind)
						}}
						disabled={disabled}
					>
						<SelectTrigger id="create-doc-kind">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{documentKindOptions.map(option => (
								<SelectItem
									key={option.value}
									value={option.value}
								>
									{option.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</FormField>
				<FormField
					label="Источник"
					htmlFor="create-doc-source-type"
				>
					<Select
						value={newDocSourceType}
						onValueChange={value => {
							onNewDocSourceTypeChange(value as ProductDocumentSourceType)
						}}
						disabled={disabled}
					>
						<SelectTrigger id="create-doc-source-type">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{documentSourceTypeOptions.map(option => (
								<SelectItem
									key={option.value}
									value={option.value}
								>
									{option.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</FormField>
				<FormField
					className="sm:col-span-2"
					label="URL"
					htmlFor="create-doc-url"
				>
					<Input
						id="create-doc-url"
						value={newDocUrl}
						onChange={event => {
							onNewDocUrlChange(event.target.value)
						}}
						disabled={disabled}
					/>
				</FormField>
			</div>
			<div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
				<Button
					type="button"
					variant="outline"
					disabled={disabled}
					onClick={() => {
						onOpenChange(false)
					}}
				>
					{'Отмена'}
				</Button>
				<Button
					type="button"
					disabled={disabled || !canSubmit}
					onClick={onConfirm}
				>
					{'Добавить'}
				</Button>
			</div>
		</Modal>
	)
}

export {ProductCreateDocumentModal}
