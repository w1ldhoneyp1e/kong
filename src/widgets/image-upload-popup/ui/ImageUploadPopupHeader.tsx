import {Button} from '../../../shared'

type ImageUploadPopupHeaderProps = {
	title: string,
	disabled: boolean,
	onClose: () => void,
}

function ImageUploadPopupHeader({
	title,
	disabled,
	onClose,
}: Readonly<ImageUploadPopupHeaderProps>) {
	return (
		<div className="mb-4 flex items-center justify-between gap-2">
			<h3
				id="image-upload-popup-title"
				className="text-lg font-semibold"
			>
				{title}
			</h3>
			<Button
				type="button"
				variant="outline"
				size="sm"
				disabled={disabled}
				onClick={onClose}
			>
				{'Закрыть'}
			</Button>
		</div>
	)
}

export {ImageUploadPopupHeader}
