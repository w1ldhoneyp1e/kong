'use client'

import {useRouter} from 'next/navigation'
import {type AdminProduct} from '../../../entities/product'
import {
	Button,
	ConfirmDialog,
	DataTable,
	EntityPageHeader,
	Link,
	StatusBadge,
} from '../../../shared'
import {ProductFormModal} from './ProductFormModal'
import {useProductsListVm} from './viewmodel/useProductsListVm'

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

function ProductsListPageClient({
	initialProducts,
}: Readonly<{initialProducts?: AdminProduct[]}>) {
	const router = useRouter()
	const vm = useProductsListVm(initialProducts)
	const createError = vm.createMutation.error
		? formatMutationError(vm.createMutation.error)
		: ''

	type ProductFormSubmitPayload =
		Parameters<typeof ProductFormModal>[0]['onSubmit'] extends (payload: infer T) => void
			? T
			: never

	const handleCreateSubmit = (payload: ProductFormSubmitPayload) => {
		vm.createMutation.mutate(
			payload,
			{
				onSuccess: product => {
					vm.setCreateOpen(false)
					router.push(`/admin/products/${product.id}`)
				},
			},
		)
	}

	const confirmDeleteId = vm.deleteConfirmId

	return (
		<div>
			<EntityPageHeader
				title="Товары"
				actions={(
					<Button
						type="button"
						onClick={() => {
							vm.setCreateOpen(true)
						}}
					>
						{'Создать товар'}
					</Button>
				)}
			/>
			<p className="mb-6 text-muted-foreground">
				{'Список товаров каталога'}
			</p>
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
			<DataTable<AdminProduct>
				className="mb-6"
				columns={[
					{
						id: 'thumb',
						header: '',
						className: 'w-14',
						cell: row => (
							row.thumbnail
								? (
									<img
										src={row.thumbnail}
										alt=""
										className="h-10 w-10 rounded-md object-cover"
									/>
								)
								: (
									<div className="h-10 w-10 rounded-md bg-muted" />
								)
						),
					},
					{
						id: 'title',
						header: 'Название',
						cell: row => row.title ?? '—',
					},
					{
						id: 'handle',
						header: 'Handle',
						cell: row => row.handle ?? '—',
					},
					{
						id: 'status',
						header: 'Статус',
						cell: row => (
							<StatusBadge status={row.status ?? 'draft'} />
						),
					},
					{
						id: 'created',
						header: 'Создан',
						cell: row => formatCreatedAt(row.created_at ?? null),
					},
				]}
				data={vm.products}
				getRowKey={row => row.id}
				loading={vm.loading}
				onRowClick={row => {
					router.push(`/admin/products/${row.id}`)
				}}
				actions={row => (
					<div className="flex justify-end gap-2">
						<Button
							size="sm"
							variant="outline"
							asChild={true}
						>
							<Link
								href={`/admin/products/${row.id}`}
								onClick={e => e.stopPropagation()}
							>
								{'Открыть'}
							</Link>
						</Button>
						<Button
							size="sm"
							variant="destructive"
							type="button"
							onClick={e => {
								e.stopPropagation()
								vm.setDeleteConfirmId(row.id)
							}}
						>
							{'Удалить'}
						</Button>
					</div>
				)}
			/>
			<ProductFormModal
				open={vm.isCreateOpen}
				title="Новый товар"
				submitLabel="Создать"
				onOpenChange={vm.setCreateOpen}
				onSubmit={handleCreateSubmit}
				submitting={vm.createMutation.isPending}
				errorText={vm.createMutation.isError
					? createError
					: ''}
			/>
			<ConfirmDialog
				open={confirmDeleteId !== null}
				onOpenChange={open => {
					if (!open) {
						vm.setDeleteConfirmId(null)
					}
				}}
				title="Удалить товар?"
				description="Действие необратимо."
				confirmLabel="Удалить"
				onConfirm={() => {
					if (confirmDeleteId) {
						vm.deleteMutation.mutate(confirmDeleteId, {
							onSettled: () => {
								vm.setDeleteConfirmId(null)
							},
						})
					}
				}}
			/>
		</div>
	)
}

export {ProductsListPageClient}
