'use client'

import {useRouter} from 'next/navigation'
import {type AdminProduct} from '../../../../entities/product'
import {
	Button,
	ConfirmDialog,
	EntityPageHeader,
	StatusBadge,
} from '../../../../shared'
import {ProductFormModal} from '../ProductFormModal'
import {useProductDetailVm} from '../viewmodel/useProductDetailVm'
import {ProductMainInfoCard} from './ProductMainInfoCard'
import {ProductMediaCard} from './ProductMediaCard'
import {ProductOptionsCard} from './ProductOptionsCard'
import {ProductVariantsCard} from './ProductVariantsCard'

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

function ProductDetailPageClient({
	id,
	initialProduct,
}: Readonly<{
	id: string,
	initialProduct?: AdminProduct,
}>) {
	const router = useRouter()
	const vm = useProductDetailVm(id, initialProduct)

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
				<ProductMainInfoCard product={p} />
				<ProductMediaCard product={p} />
				<ProductVariantsCard product={p} />
				<ProductOptionsCard product={p} />
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
