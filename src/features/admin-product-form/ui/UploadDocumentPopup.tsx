'use client'

import {
	Button,
	FormField,
	Input,
	Modal,
} from '../../../shared'
import {DocumentUploaderDropzone} from '../../uploader/documents'
import {useAdminProductFormViewmodel} from '../viewmodel'

function UploadDocumentPopup() {
	const {documents} = useAdminProductFormViewmodel()
	const canSubmit
		= documents.newItem.title.trim().length > 0 && documents.newItem.url.trim().length > 0

	return (
		<Modal
			open={documents.isModalOpen}
			onOpenChange={documents.onOpenChange}
			disabled={documents.disabled}
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
					disabled={documents.disabled}
					onClick={documents.onCloseModal}
				>
					{'Закрыть'}
				</Button>
			</div>
			<div className="grid gap-4 sm:grid-cols-2">
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
				<FormField
					className="sm:col-span-2"
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
