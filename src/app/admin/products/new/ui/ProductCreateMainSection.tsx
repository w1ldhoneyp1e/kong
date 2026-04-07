import {
	FormField,
	Input,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../../../../../shared'

function ProductCreateMainSection({
	title,
	handle,
	status,
	disabled,
	statusOptions,
	onTitleChange,
	onHandleChange,
	onStatusChange,
}: Readonly<{
	title: string,
	handle: string,
	status: string,
	disabled: boolean,
	statusOptions: {
		value: string,
		label: string,
	}[],
	onTitleChange: (value: string) => void,
	onHandleChange: (value: string) => void,
	onStatusChange: (value: string) => void,
}>) {
	return (
		<section className="space-y-4">
			<h3 className="text-sm font-medium text-muted-foreground">
				{'Основное'}
			</h3>
			<div className="grid gap-4 sm:grid-cols-2">
				<FormField
					className="sm:col-span-2"
					label="Название"
					htmlFor="create-product-title"
				>
					<Input
						id="create-product-title"
						value={title}
						onChange={event => {
							onTitleChange(event.target.value)
						}}
						required={true}
						disabled={disabled}
					/>
				</FormField>
				<FormField
					label="Ссылка доступа (url)"
					htmlFor="create-product-handle"
				>
					<Input
						id="create-product-handle"
						value={handle}
						onChange={event => {
							onHandleChange(event.target.value)
						}}
						disabled={disabled}
					/>
				</FormField>
				<FormField
					label="Статус"
					htmlFor="create-product-status"
				>
					<Select
						value={status}
						onValueChange={onStatusChange}
						disabled={disabled}
					>
						<SelectTrigger id="create-product-status">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{statusOptions.map(option => (
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
			</div>
		</section>
	)
}

export {ProductCreateMainSection}
