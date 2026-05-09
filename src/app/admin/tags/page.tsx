'use client'

import {
	Pencil,
	Trash2,
} from 'lucide-react'
import {useMemo, useState} from 'react'
import {
	type AdminTagOption,
	useCreateProductTagMutation,
	useDeleteProductTagMutation,
	useProductTagsQuery,
	useUpdateProductTagMutation,
} from '../../../entities/product'
import {
	Button,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	ConfirmDialog,
	EntityPageHeader,
	Input,
} from '../../../shared'

type FormState = {
	value: string,
	color: string,
}

const DEFAULT_COLOR = '#334155'

function toFormState(tag?: AdminTagOption | null): FormState {
	return {
		value: tag?.value ?? '',
		color: tag?.color ?? DEFAULT_COLOR,
	}
}

export default function AdminTagsPage() {
	const {data: tags = [], isLoading} = useProductTagsQuery()
	const createMutation = useCreateProductTagMutation()
	const updateMutation = useUpdateProductTagMutation()
	const deleteMutation = useDeleteProductTagMutation()
	const [form, setForm] = useState<FormState>({
		value: '',
		color: DEFAULT_COLOR,
	})
	const [editingId, setEditingId] = useState<string | null>(null)
	const [deleteId, setDeleteId] = useState<string | null>(null)
	const [message, setMessage] = useState('')
	const [error, setError] = useState('')

	const editingTag = useMemo(
		() => tags.find(tag => tag.id === editingId) ?? null,
		[editingId, tags],
	)

	const saving = createMutation.isPending || updateMutation.isPending

	const resetForm = () => {
		setEditingId(null)
		setForm(toFormState(null))
	}

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault()
		const value = form.value.trim()
		if (!value) {
			setError('Введите название тега')
			return
		}

		setError('')
		setMessage('')

		try {
			if (editingId) {
				await updateMutation.mutateAsync({
					id: editingId,
					payload: {
						value,
						color: form.color,
					},
				})
				setMessage('Тег обновлен')
			}
			else {
				await createMutation.mutateAsync({
					value,
					color: form.color,
				})
				setMessage('Тег создан')
			}

			resetForm()
		}
		catch (cause) {
			setError(cause instanceof Error
				? cause.message
				: 'Не удалось сохранить тег')
		}
	}

	return (
		<div className="space-y-6">
			<EntityPageHeader title="Теги" />
			<p className="text-sm text-muted-foreground">
				{'Управление товарными тегами и их цветами для витрины.'}
			</p>

			{error
				? (
					<div className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
						{error}
					</div>
				)
				: null}
			{message
				? (
					<div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
						{message}
					</div>
				)
				: null}

			<div className="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
				<Card>
					<CardHeader>
						<CardTitle>
							{editingTag
								? 'Редактирование тега'
								: 'Новый тег'}
						</CardTitle>
						<CardDescription>
							{'Теги затем выбираются в карточке товара.'}
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form
							onSubmit={handleSubmit}
							className="space-y-4"
						>
							<div className="space-y-2">
								<label
									htmlFor="tag-value"
									className="text-sm font-medium"
								>
									{'Название'}
								</label>
								<Input
									id="tag-value"
									value={form.value}
									onChange={event => {
										setForm(current => ({
											...current,
											value: event.target.value,
										}))
									}}
									disabled={saving}
								/>
							</div>

							<div className="space-y-2">
								<label
									htmlFor="tag-color"
									className="text-sm font-medium"
								>
									{'Цвет'}
								</label>
								<div className="flex items-center gap-3">
									<input
										id="tag-color"
										type="color"
										value={form.color}
										onChange={event => {
											setForm(current => ({
												...current,
												color: event.target.value,
											}))
										}}
										disabled={saving}
										className="h-10 w-14 rounded-md border border-input bg-background p-1"
									/>
									<Input
										value={form.color}
										onChange={event => {
											setForm(current => ({
												...current,
												color: event.target.value,
											}))
										}}
										disabled={saving}
									/>
								</div>
							</div>

							<div className="flex items-center justify-end gap-2">
								{editingTag
									? (
										<Button
											type="button"
											variant="outline"
											onClick={resetForm}
										>
											{'Отмена'}
										</Button>
									)
									: null}
								<Button
									type="submit"
									state={saving
										? 'loading'
										: 'default'}
								>
									{editingTag
										? 'Сохранить тег'
										: 'Создать тег'}
								</Button>
							</div>
						</form>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>{'Все теги'}</CardTitle>
						<CardDescription>{'Их можно использовать в товарах и на карточках витрины.'}</CardDescription>
					</CardHeader>
					<CardContent className="space-y-3">
						{isLoading
							? <p className="text-sm text-muted-foreground">{'Загрузка...'}</p>
							: null}
						{!isLoading && tags.length === 0
							? <p className="text-sm text-muted-foreground">{'Теги пока не созданы'}</p>
							: null}
						{tags.map(tag => (
							<div
								key={tag.id}
								className="flex items-center justify-between gap-4 rounded-md border border-border px-4 py-3"
							>
								<div className="min-w-0">
									<div className="flex items-center gap-2">
										<span
											aria-hidden="true"
											className="inline-block size-3 rounded-full border border-black/10"
											style={{backgroundColor: tag.color ?? DEFAULT_COLOR}}
										/>
										<p className="truncate font-medium">
											{tag.value ?? tag.id}
										</p>
									</div>
									<p className="mt-1 text-xs text-muted-foreground">
										{tag.color ?? DEFAULT_COLOR}
									</p>
								</div>
								<div className="flex items-center gap-1">
									<Button
										type="button"
										size="icon"
										variant="ghost"
										className="size-9 rounded-md"
										onClick={() => {
											setEditingId(tag.id)
											setForm(toFormState(tag))
											setError('')
											setMessage('')
										}}
										aria-label="Редактировать тег"
									>
										<Pencil className="size-4" />
									</Button>
									<Button
										type="button"
										size="icon"
										variant="ghost"
										className="size-9 rounded-md"
										onClick={() => {
											setDeleteId(tag.id)
										}}
										aria-label="Удалить тег"
									>
										<Trash2 className="size-4 text-destructive" />
									</Button>
								</div>
							</div>
						))}
					</CardContent>
				</Card>
			</div>

			<ConfirmDialog
				open={deleteId !== null}
				onOpenChange={open => {
					if (!open) {
						setDeleteId(null)
					}
				}}
				title="Удалить тег?"
				description="Тег исчезнет из справочника. У уже сохраненных товаров он перестанет отображаться."
				confirmLabel="Удалить"
				onConfirm={() => {
					if (!deleteId) {
						return
					}

					deleteMutation.mutate(deleteId, {
						onSuccess: () => {
							if (editingId === deleteId) {
								resetForm()
							}
							setDeleteId(null)
							setMessage('Тег удален')
						},
						onError: (cause: unknown) => {
							setDeleteId(null)
							setError(cause instanceof Error
								? cause.message
								: 'Не удалось удалить тег')
						},
					})
				}}
			/>
		</div>
	)
}
