'use client'

import {Pencil, Trash2} from 'lucide-react'
import {useRouter} from 'next/navigation'
import {
	type AdminProduct,
	getProductStatusLabel,
	normalizeProductStatus,
} from '../../../entities/product'
import {
	Button,
	ConfirmDialog,
	DataTable,
	EntityPageHeader,
	StatusBadge,
} from '../../../shared'
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

function ProductsListPageClient({
	initialProducts,
}: Readonly<{initialProducts?: AdminProduct[]}>) {
	const router = useRouter()
	const vm = useProductsListVm(initialProducts)
	const confirmDeleteId = vm.deleteConfirmId

	return (
		<div>
			<EntityPageHeader
				title="Товары"
				actions={(
					<Button
						type="button"
						onClick={() => {
							router.push('/admin/products/new')
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
						header: 'Ссылка',
						cell: row => row.handle ?? '—',
					},
					{
						id: 'status',
						header: 'Статус',
						cell: row => (
							<StatusBadge
								status={normalizeProductStatus(row.status)}
								label={getProductStatusLabel(row.status)}
							/>
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
					<div className="relative z-10 flex justify-end gap-1">
						<Button
							type="button"
							size="icon"
							variant="ghost"
							className="size-9 rounded-md hover:bg-background focus-visible:bg-background"
							aria-label="Редактировать товар"
							onClick={event => {
								event.stopPropagation()
								router.push(`/admin/products/${row.id}/edit`)
							}}
						>
							<Pencil className="size-5" />
						</Button>
						<Button
							type="button"
							size="icon"
							variant="ghost"
							className="size-9 rounded-md hover:bg-background focus-visible:bg-background"
							aria-label="Удалить товар"
							onClick={event => {
								event.stopPropagation()
								vm.setDeleteConfirmId(row.id)
							}}
						>
							<Trash2 className="size-5 text-destructive" />
						</Button>
					</div>
				)}
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
