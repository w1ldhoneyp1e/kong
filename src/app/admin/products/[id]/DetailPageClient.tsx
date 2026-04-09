'use client'

import {useRouter} from 'next/navigation'
import {type AdminProduct} from '../../../../entities/product'
import {
	Button,
	ConfirmDialog,
	EntityPageHeader,
	StatusBadge,
} from '../../../../shared'
import {useProductDetailVm} from '../viewmodel/useProductDetailVm'
import {ProductMainInfoCard} from './MainInfoCard'
import {ProductMediaCard} from './MediaCard'
import {ProductOptionsCard} from './OptionsCard'
import {ProductVariantsCard} from './VariantsCard'

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

function ProductDetailPageClient({
	id,
	initialProduct,
}: Readonly<{
	id: string,
	initialProduct?: AdminProduct,
}>) {
	const router = useRouter()
	const vm = useProductDetailVm(id, initialProduct)

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
