'use client'

import {type FlattenCategoryItem} from '../../../entities/category'
import {
	Button,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	Input,
	Select,
	SelectClearButton,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../../../shared'

type CreateCategoryFormProps = {
	name: string,
	slug: string,
	parentId: string | null,
	parentOptions: FlattenCategoryItem[],
	onNameChange: (value: string) => void,
	onSlugChange: (value: string) => void,
	onParentIdChange: (value: string | null) => void,
	onSubmit: (ev: React.FormEvent) => void,
	submitPending?: boolean,
}

function CreateCategoryForm({
	name,
	slug,
	parentId,
	parentOptions,
	onNameChange,
	onSlugChange,
	onParentIdChange,
	onSubmit,
	submitPending = false,
}: CreateCategoryFormProps) {
	return (
		<div className="lg:col-span-1">
			<Card>
				<CardHeader>
					<CardTitle>{'Создать категорию'}</CardTitle>
					<CardDescription>{'Добавь новую категорию или подкатегорию'}</CardDescription>
				</CardHeader>
				<CardContent>
					<form
						onSubmit={onSubmit}
						className="space-y-4"
					>
						<div>
							<label className="text-sm font-medium mb-1 block">
								{'Родительская категория'}
							</label>
							<div className="flex h-9 w-full items-center overflow-hidden rounded-md border border-input">
								<Select
									value={parentId ?? ''}
									onValueChange={v => onParentIdChange(v === ''
										? null
										: v)}
								>
									<SelectTrigger
										className={parentId
											? 'flex-1 rounded-none border-0 border-r border-input focus:ring-0 data-[state=open]:rounded-none'
											: 'flex-1 rounded-r-md border-0 focus:ring-0'}
									>
										<SelectValue placeholder="Без родителя" />
									</SelectTrigger>
									<SelectContent>
										{parentOptions.map(args => (
											<SelectItem
												key={args.id}
												value={args.id}
											>
												{'\u00A0'.repeat(args.depth * 2)}{args.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								{parentId
									? (
										<SelectClearButton
											onClick={() => onParentIdChange(null)}
											aria-label="Снять выбор"
										/>
									)
									: null}
							</div>
						</div>
						<div>
							<label className="text-sm font-medium mb-1 block">
								{'Название'}
							</label>
							<Input
								type="text"
								placeholder="Электроника"
								value={name}
								onChange={e => onNameChange(e.target.value)}
							/>
						</div>
						<div>
							<label className="text-sm font-medium mb-1 block">
								{'Путь (url-адрес)'}
							</label>
							<Input
								type="text"
								placeholder="electronics"
								value={slug}
								onChange={e => onSlugChange(e.target.value)}
							/>
						</div>
						<Button
							type="submit"
							className="w-full"
							disabled={submitPending}
						>
							{submitPending
								? 'Создание...'
								: 'Создать'}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	)
}

export {
	CreateCategoryForm,
	type CreateCategoryFormProps,
}
