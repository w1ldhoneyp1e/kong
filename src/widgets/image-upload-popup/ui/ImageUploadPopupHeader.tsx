import {X} from 'lucide-react'

type ImageUploadPopupHeaderProps = {
	title: string,
	onClose: () => void,
}

function ImageUploadPopupHeader({
	title,
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
			<X
				className="size-6 cursor-pointer text-muted-foreground hover:text-foreground"
				aria-hidden={true}
				onClick={onClose}
			/>
		</div>
	)
}

export {ImageUploadPopupHeader}
