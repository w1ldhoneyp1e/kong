'use client'

import {
	FormField,
	Input,
	Popup,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../../../shared'
import {DocumentUploaderDropzone} from '../../uploader/documents'
import {type ProductDocumentSourceType} from '../types'
import {type AdminProductFormViewmodel} from '../viewmodel'

type UploadDocumentPopupProps = {
	documents: AdminProductFormViewmodel['documents'],
}

function UploadDocumentPopup({
	documents,
}: Readonly<UploadDocumentPopupProps>) {
	const canSubmit
		= documents.newItem.title.trim().length > 0 && documents.newItem.url.trim().length > 0
	const isFileMode = documents.newItem.sourceType === 'file'

	return (
		<Popup
			title="Новый документ"
			onClose={documents.onCloseModal}
			onSubmit={documents.onAdd}
			submitBtn={{
				label: 'Добавить',
				onClick: documents.onAdd,
				state: canSubmit
					? undefined
					: 'disabled',
			}}
			disabled={documents.disabled}
			className="h-[min(90vh,400px)] max-w-lg"
		>
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
		</Popup>
	)
}

export {UploadDocumentPopup}
