import {
	FormField,
	Input,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../../../shared'
import {type AdminProductFormViewmodel} from '../viewmodel'

const EMPTY_CATEGORY_VALUE = '__none__'

type MainSectionProps = {
	main: AdminProductFormViewmodel['main'],
}

function MainSection({
	main,
}: MainSectionProps) {
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
						value={main.title}
						onChange={event => {
							main.onTitleChange(event.target.value)
						}}
						required={true}
						disabled={main.disabled}
					/>
				</FormField>
				<FormField
					label="Ссылка доступа (url)"
					htmlFor="create-product-handle"
				>
					<Input
						id="create-product-handle"
						value={main.handle}
						onChange={event => {
							main.onHandleChange(event.target.value)
						}}
						disabled={main.disabled}
					/>
				</FormField>
				<FormField
					label="Статус"
					htmlFor="create-product-status"
				>
					<Select
						value={main.status}
						onValueChange={main.onStatusChange}
						disabled={main.disabled}
					>
						<SelectTrigger id="create-product-status">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{main.statusOptions.map(option => (
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
					className="sm:col-span-2"
					label="Категория"
					htmlFor="create-product-category"
				>
					<Select
						value={main.selectedCategoryId ?? EMPTY_CATEGORY_VALUE}
						onValueChange={value => {
							main.onCategoryChange(value === EMPTY_CATEGORY_VALUE
								? null
								: value)
						}}
						disabled={main.disabled}
					>
						<SelectTrigger id="create-product-category">
							<SelectValue placeholder="Без категории" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value={EMPTY_CATEGORY_VALUE}>
								{'Без категории'}
							</SelectItem>
							{main.categoryOptions.map(category => (
								<SelectItem
									key={category.id}
									value={category.id}
								>
									{category.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</FormField>
			</div>
		</section>
	)
}

export {MainSection}
