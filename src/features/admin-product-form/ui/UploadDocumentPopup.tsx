'use client'

import {X} from 'lucide-react'
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
} from '../../../shared'
import {DocumentUploaderDropzone} from '../../uploader/documents'
import {type ProductDocumentSourceType} from '../types'
import {useAdminProductFormViewmodel} from '../viewmodel'

function UploadDocumentPopup() {
	const {documents} = useAdminProductFormViewmodel()
	const canSubmit
		= documents.newItem.title.trim().length > 0 && documents.newItem.url.trim().length > 0
	const isFileMode = documents.newItem.sourceType === 'file'

	return (
		<Modal
			open={documents.isModalOpen}
			onOpenChange={documents.onOpenChange}
			disabled={documents.disabled}
			className="h-[min(90vh,390px)] max-w-lg overflow-y-auto"
			ariaLabelledBy="create-document-modal-title"
		>
			<div className="mb-4 flex items-center justify-between gap-2">
				<h3
					id="create-document-modal-title"
					className="text-lg font-semibold"
				>
					{'Новый документ'}
				</h3>
				<X
					className="size-6 cursor-pointer text-muted-foreground hover:text-foreground"
					aria-hidden={true}
					onClick={documents.onCloseModal}
				/>
			</div>
			<div className="flex flex-col gap-4">
				<div className="flex justify-between gap-4">
					<FormField
						className="w-[250px]"
						label="Тип загрузки"
						htmlFor="create-doc-type"
					>
						<Select
							value={documents.newItem.sourceType}
							onValueChange={value => {
								documents.onNewSourceTypeChange(value as ProductDocumentSourceType)
							}}
							disabled={documents.disabled}
						>
							<SelectTrigger id="create-doc-type">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{documents.sourceTypeOptions.map(option => (
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
						className="w-full"
						label="Название"
						htmlFor="create-doc-title"
					>
						<Input
							id="create-doc-title"
							value={documents.newItem.title}
							onChange={event => {
								documents.onNewTitleChange(event.target.value)
							}}
							disabled={documents.disabled}
						/>
					</FormField>
				</div>
				{isFileMode
					? (
						<div className="space-y-2 sm:col-span-2">
							<DocumentUploaderDropzone
								open={documents.isModalOpen}
								disabled={documents.disabled}
								onUploaded={items => {
									const first = items[0]
									if (!first) {
										return
									}

									documents.onNewSourceTypeChange('file')
									documents.onNewTitleChange(first.title)
									documents.onNewUrlChange(first.url)
								}}
							/>
						</div>
					)
					: (
						<FormField
							className="sm:col-span-2"
							label="URL"
							htmlFor="create-doc-url"
						>
							<Input
								id="create-doc-url"
								value={documents.newItem.url}
								onChange={event => {
									documents.onNewUrlChange(event.target.value)
								}}
								disabled={documents.disabled}
							/>
						</FormField>
					)}
			</div>
			<div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
				<Button
					type="button"
					variant="outline"
					disabled={documents.disabled}
					onClick={documents.onCloseModal}
				>
					{'Отмена'}
				</Button>
				<Button
					type="button"
					disabled={documents.disabled || !canSubmit}
					onClick={documents.onAdd}
				>
					{'Добавить'}
				</Button>
			</div>
		</Modal>
	)
}

export {UploadDocumentPopup}
