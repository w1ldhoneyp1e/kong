'use client'

import {FileDropzone} from '../../../widgets/file-dropzone'
import {uploadProductImageFiles} from './uploadProductImageFiles'

type ImageUploaderDropzoneProps = {
	open: boolean,
	disabled: boolean,
	onUploaded: (urls: string[]) => void | Promise<void>,
}

function ImageUploaderDropzone({
	open,
	disabled,
	onUploaded,
}: Readonly<ImageUploaderDropzoneProps>) {
	return (
		<FileDropzone
			open={open}
			disabled={disabled}
			accept="image/*"
			acceptFile={file => file.type.startsWith('image/')}
			uploader={uploadProductImageFiles}
			onUploaded={onUploaded}
		/>
	)
}

export {
	ImageUploaderDropzone,
}
export type {
	ImageUploaderDropzoneProps,
}
