import {
	Button,
	FormField,
	Input,
} from '../../../shared'

type ImageUploadUrlInputProps = {
	disabled: boolean,
	value: string,
	onValueChange: (value: string) => void,
	onAdd: () => void,
}

function ImageUploadUrlInput({
	disabled,
	value,
	onValueChange,
	onAdd,
}: Readonly<ImageUploadUrlInputProps>) {
	return (
		<div className="grid gap-2 sm:grid-cols-[1fr_auto]">
			<FormField
				label="URL изображения"
				htmlFor="create-product-image-draft"
			>
				<Input
					id="create-product-image-draft"
					value={value}
					onChange={event => {
						onValueChange(event.target.value)
					}}
					disabled={disabled}
					placeholder="https://"
					onKeyDown={event => {
						if (event.key === 'Enter') {
							event.preventDefault()
							onAdd()
						}
					}}
				/>
			</FormField>
			<div className="flex items-end">
				<Button
					type="button"
					variant="outline"
					disabled={disabled || value.trim().length === 0}
					onClick={onAdd}
				>
					{'Добавить'}
				</Button>
			</div>
		</div>
	)
}

export {ImageUploadUrlInput}
