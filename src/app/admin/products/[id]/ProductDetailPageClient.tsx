'use client'

import {useRouter} from 'next/navigation'
import {
	Button,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	ConfirmDialog,
	EntityPageHeader,
	StatusBadge,
} from '../../../../shared'
import {ProductFormModal} from '../ProductFormModal'
import {useProductDetailVm} from '../viewmodel/useProductDetailVm'

function formatCreatedAt(value: string | null | undefined): string {
	if (!value) {
		return '—'
	}

	const d = new Date(value)

	if (Number.isNaN(d.getTime())) {
		return value
	}

	return d.toLocaleString('ru-RU')
}

function formatMutationError(err: unknown): string {
	if (err instanceof Error) {
		return err.message
	}

	return String(err)
}

function ProductDetailPageClient({id}: Readonly<{id: string}>) {
	const router = useRouter()
	const vm = useProductDetailVm(id)

	const updateError = vm.updateMutation.error
		? formatMutationError(vm.updateMutation.error)
		: ''

	if (vm.loading && !vm.product) {
		return (
			<p className="text-muted-foreground">
				{'Загрузка…'}
			</p>
		)
	}

	if (!vm.product) {
		return (
			<p className="text-destructive">
				{'Товар не найден'}
			</p>
		)
	}

	const p = vm.product

	const handleUpdate = (payload: {
		title: string,
		handle: string,
		status: string,
	}) => {
		vm.updateMutation.mutate(
			{
				id,
				payload: {
					title: payload.title,
					handle: payload.handle
						|| undefined,
					status: payload.status,
				},
			},
			{
				onSuccess: () => {
					vm.setEditOpen(false)
				},
			},
		)
	}

	return (
		<div>
			<EntityPageHeader
				title={p.title ?? 'Товар'}
				backHref="/admin/products"
				actions={(
					<>
						<Button
							type="button"
							variant="outline"
							onClick={() => {
								vm.setEditOpen(true)
							}}
						>
							{'Редактировать'}
						</Button>
						<Button
							type="button"
							variant="destructive"
							onClick={() => {
								vm.setDeleteConfirmOpen(true)
							}}
						>
							{'Удалить'}
						</Button>
					</>
				)}
			/>
			{vm.error && !vm.loading
				? (
					<p
						className="mb-4 text-sm text-destructive"
						role="alert"
					>
						{vm.error}
					</p>
				)
				: null}
			<div className="mb-6 flex flex-wrap items-center gap-3">
				<StatusBadge status={p.status ?? 'draft'} />
				<span className="text-sm text-muted-foreground">
					{`Создан: ${formatCreatedAt(p.created_at ?? null)}`}
				</span>
			</div>
			<div className="grid gap-6 lg:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>
							{'Основная информация'}
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-2 text-sm">
						<p>
							<span className="font-medium text-muted-foreground">
								{'Handle: '}
							</span>
							{p.handle ?? '—'}
						</p>
						{p.subtitle
							? (
								<p>
									<span className="font-medium text-muted-foreground">
										{'Подзаголовок: '}
									</span>
									{p.subtitle}
								</p>
							)
							: null}
						{p.description
							? (
								<p className="whitespace-pre-wrap">
									<span className="font-medium text-muted-foreground">
										{'Описание: '}
									</span>
									{p.description}
								</p>
							)
							: null}
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>
							{'Медиа'}
						</CardTitle>
					</CardHeader>
					<CardContent>
						{p.thumbnail
							? (
								<div className="mb-4">
									<p className="mb-2 text-xs font-medium text-muted-foreground">
										{'Thumbnail'}
									</p>
									<img
										src={p.thumbnail}
										alt=""
										className="max-h-48 rounded-md border object-contain"
									/>
								</div>
							)
							: null}
						{p.images && p.images.length > 0
							? (
								<div className="flex flex-wrap gap-2">
									{p.images.map(img => (
										img.url
											? (
												<img
													key={img.id}
													src={img.url}
													alt=""
													className="h-20 w-20 rounded object-cover"
												/>
											)
											: null
									))}
								</div>
							)
							: (
								<p className="text-sm text-muted-foreground">
									{'Нет изображений'}
								</p>
							)}
					</CardContent>
				</Card>
				<Card className="lg:col-span-2">
					<CardHeader>
						<CardTitle>
							{'Варианты'}
						</CardTitle>
					</CardHeader>
					<CardContent>
						{p.variants && p.variants.length > 0
							? (
								<div className="overflow-x-auto rounded-md border">
									<table className="w-full text-sm">
										<thead className="bg-muted/50">
											<tr>
												<th className="px-3 py-2 text-left font-medium">
													{'Название'}
												</th>
												<th className="px-3 py-2 text-left font-medium">
													{'SKU'}
												</th>
												<th className="px-3 py-2 text-left font-medium">
													{'ID'}
												</th>
											</tr>
										</thead>
										<tbody>
											{p.variants.map(v => (
												<tr
													key={v.id}
													className="border-t"
												>
													<td className="px-3 py-2">
														{v.title ?? '—'}
													</td>
													<td className="px-3 py-2">
														{v.sku ?? '—'}
													</td>
													<td className="px-3 py-2 font-mono text-xs text-muted-foreground">
														{v.id}
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							)
							: (
								<p className="text-sm text-muted-foreground">
									{'Нет вариантов'}
								</p>
							)}
					</CardContent>
				</Card>
				<Card className="lg:col-span-2">
					<CardHeader>
						<CardTitle>
							{'Опции'}
						</CardTitle>
					</CardHeader>
					<CardContent>
						{p.options && p.options.length > 0
							? (
								<ul className="space-y-2 text-sm">
									{p.options.map(opt => (
										<li key={opt.id}>
											<span className="font-medium">
												{opt.title ?? opt.id}
												{': '}
											</span>
											{(opt.values ?? [])
												.map(val => val.value)
												.filter(Boolean)
												.join(', ') || '—'}
										</li>
									))}
								</ul>
							)
							: (
								<p className="text-sm text-muted-foreground">
									{'Нет опций'}
								</p>
							)}
					</CardContent>
				</Card>
			</div>
			<ProductFormModal
				open={vm.isEditOpen}
				title="Редактирование товара"
				onOpenChange={vm.setEditOpen}
				onSubmit={handleUpdate}
				submitting={vm.updateMutation.isPending}
				errorText={vm.updateMutation.isError
					? updateError
					: ''}
				initialTitle={p.title ?? ''}
				initialHandle={p.handle ?? ''}
				initialStatus={p.status ?? 'draft'}
			/>
			<ConfirmDialog
				open={vm.deleteConfirmOpen}
				onOpenChange={vm.setDeleteConfirmOpen}
				title="Удалить товар?"
				description="Действие необратимо."
				confirmLabel="Удалить"
				onConfirm={() => {
					vm.deleteMutation.mutate(id, {
						onSuccess: () => {
							router.push('/admin/products')
						},
					})
				}}
			/>
		</div>
	)
}

export {ProductDetailPageClient}
