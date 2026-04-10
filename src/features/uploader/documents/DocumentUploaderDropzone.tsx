'use client'

import {FileDropzone} from '../../../widgets/file-dropzone'
import {type UploadedProductDocument, uploadProductDocumentFiles} from './uploadProductDocumentFiles'

type DocumentUploaderDropzoneProps = {
	open: boolean,
	disabled: boolean,
	onUploaded: (items: UploadedProductDocument[]) => void | Promise<void>,
}

function DocumentUploaderDropzone({
	open,
	disabled,
	onUploaded,
}: Readonly<DocumentUploaderDropzoneProps>) {
	return (
		<FileDropzone
			open={open}
			disabled={disabled}
			className="min-h-[8.5rem]"
			message="Перетащите файл сюда или скопируйте и вставьте"
			primaryActionLabel="С компьютера"
			acceptFile={() => true}
			uploader={uploadProductDocumentFiles}
			onUploaded={onUploaded}
			multiple={false}
		/>
	)
}

export {
	DocumentUploaderDropzone,
}
export type {
	DocumentUploaderDropzoneProps,
}
