'use client'

import {useRouter} from 'next/navigation'
import {
	type AdminProduct,
	getProductStatusLabel,
	type UpdateProductPayload,
} from '../../../../entities/product'
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

function buildProductUpdatePayload(product: AdminProduct, status: 'draft' | 'published'): UpdateProductPayload {
	const primaryThumbnail = product.thumbnail ?? product.images?.[0]?.url ?? null

	return {
		title: product.title ?? '',
		subtitle: product.subtitle ?? null,
		description: product.description ?? null,
		handle: product.handle ?? undefined,
		status,
		thumbnail: primaryThumbnail,
		images: (product.images ?? [])
			.map(image => image.url?.trim())
			.filter((url): url is string => Boolean(url))
			.map(url => ({url})),
		material: product.material ?? null,
		weight: product.weight ?? null,
		length: product.length ?? null,
		width: product.width ?? null,
		height: product.height ?? null,
		tag_ids: (product.tags ?? [])
			.map(tag => tag.id)
			.filter(Boolean),
		category_ids: (product.categories ?? [])
			.map(category => category.id)
			.filter(Boolean),
		variants: (product.variants ?? []).map(variant => ({
			id: variant.id,
			title: variant.title?.trim() || 'Основной',
			sku: variant.sku ?? undefined,
			prices: (variant.prices ?? [])
				.filter(price => typeof price.amount === 'number' && Boolean(price.currency_code))
				.map(price => ({
					amount: price.amount as number,
					currency_code: price.currency_code as string,
				})),
			metadata: {
				...(variant.metadata ?? {}),
				available: variant.metadata?.available !== false,
			},
		})),
		metadata: {
			documents: product.metadata?.documents ?? [],
		},
	}
}

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
	const publishPayload = buildProductUpdatePayload(p, 'published')
	const unpublishPayload = buildProductUpdatePayload(p, 'draft')

	return (
		<div>
			<EntityPageHeader
				title={p.title ?? 'Товар'}
				backHref="/admin/products"
				actions={(
					<>
						{p.status !== 'published'
							? (
								<Button
									type="button"
									onClick={() => {
										vm.updateMutation.mutate({
											id,
											payload: publishPayload,
										})
									}}
									disabled={vm.updateMutation.isPending}
								>
									{'Опубликовать'}
								</Button>
							)
							: (
								<Button
									type="button"
									variant="outline"
									onClick={() => {
										vm.updateMutation.mutate({
											id,
											payload: unpublishPayload,
										})
									}}
									disabled={vm.updateMutation.isPending}
								>
									{'Снять с публикации'}
								</Button>
							)}
						<Button
							type="button"
							variant="outline"
							onClick={() => {
								router.push(`/admin/products/${id}/edit`)
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
				<StatusBadge
					status={p.status}
					label={getProductStatusLabel(p.status)}
				/>
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
