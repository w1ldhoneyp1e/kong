import {FormField, Input} from '../../../../../shared'

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
					<select
						id="create-product-status"
						className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
						value={status}
						onChange={event => {
							onStatusChange(event.target.value)
						}}
						disabled={disabled}
					>
						{statusOptions.map(option => (
							<option
								key={option.value}
								value={option.value}
							>
								{option.label}
							</option>
						))}
					</select>
				</FormField>
			</div>
		</section>
	)
}

export {ProductCreateMainSection}
