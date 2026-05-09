'use client'

import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	type SortingState,
	useReactTable,
} from '@tanstack/react-table'
import {
	Check,
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	ChevronUp,
	Pencil,
	Trash2,
} from 'lucide-react'
import {useRouter} from 'next/navigation'
import {useMemo, useState} from 'react'
import {type AdminProduct, getProductStatusLabel} from '../../../entities/product'
import {
	Button,
	ConfirmDialog,
	EntityPageHeader,
	Input,
	StatusBadge,
	cn,
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

function getProductQuantity(product: AdminProduct): number | null {
	const quantity = product.variants?.[0]?.stock_quantity
		?? product.variants?.[0]?.metadata?.stock_quantity

	return typeof quantity === 'number'
		? quantity
		: null
}

function SortableHeader({
	title,
	sorted,
	canSort,
	onClick,
	className,
}: Readonly<{
	title: string,
	sorted: false | 'asc' | 'desc',
	canSort: boolean,
	onClick: () => void,
	className?: string,
}>) {
	if (!canSort) {
		return (
			<span className={className}>
				{title}
			</span>
		)
	}

	return (
		<button
			type="button"
			className={cn(
				'inline-flex items-center gap-1 rounded-md px-1 py-0.5 -mx-1 hover:bg-muted/80 hover:text-foreground',
				'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
				className,
			)}
			onClick={onClick}
		>
			<span>{title}</span>
			{sorted === 'asc'
				? <ChevronUp className="size-4 opacity-70" />
				: null}
			{sorted === 'desc'
				? <ChevronDown className="size-4 opacity-70" />
				: null}
		</button>
	)
}

function ProductsListPageClient({
	initialProducts,
}: Readonly<{initialProducts?: AdminProduct[]}>) {
	const router = useRouter()
	const vm = useProductsListVm(initialProducts)
	const [quantityDrafts, setQuantityDrafts] = useState<Record<string, string>>({})
	const [sorting, setSorting] = useState<SortingState>([
		{
			id: 'created_at',
			desc: true,
		},
	])
	const [globalFilter, setGlobalFilter] = useState('')
	const confirmDeleteId = vm.deleteConfirmId
	const pendingQuantityId = vm.updateStockMutation.variables?.id

	const quantityByProductId = useMemo(
		() => Object.fromEntries(
			vm.products.map(product => {
				const quantity = getProductQuantity(product)
				return [product.id, quantity === null
					? ''
					: String(quantity)]
			}),
		),
		[vm.products],
	)

	const columns = useMemo<ColumnDef<AdminProduct>[]>(() => [
		{
			id: 'thumb',
			header: () => '',
			cell: ({row}) => (
				row.original.thumbnail
					? (
						<img
							src={row.original.thumbnail}
							alt=""
							className="h-10 w-10 rounded-md object-cover"
						/>
					)
					: (
						<div className="h-10 w-10 rounded-md bg-muted" />
					)
			),
			enableSorting: false,
			meta: {
				headerClassName: 'w-14',
				cellClassName: 'w-14',
			},
		},
		{
			id: 'title',
			header: ({column}) => (
				<SortableHeader
					title="Название"
					sorted={column.getIsSorted()}
					canSort={column.getCanSort()}
					onClick={() => {
						column.getToggleSortingHandler()?.({} as never)
					}}
				/>
			),
			accessorFn: row => row.title ?? '',
			cell: ({row}) => row.original.title ?? '—',
			sortingFn: 'alphanumeric',
		},
		{
			id: 'handle',
			header: ({column}) => (
				<SortableHeader
					title="Ссылка"
					sorted={column.getIsSorted()}
					canSort={column.getCanSort()}
					onClick={() => {
						column.getToggleSortingHandler()?.({} as never)
					}}
				/>
			),
			accessorFn: row => row.handle ?? '',
			cell: ({row}) => row.original.handle ?? '—',
			sortingFn: 'alphanumeric',
		},
		{
			id: 'stock',
			header: ({column}) => (
				<SortableHeader
					title="Остаток"
					sorted={column.getIsSorted()}
					canSort={column.getCanSort()}
					onClick={() => {
						column.getToggleSortingHandler()?.({} as never)
					}}
				/>
			),
			accessorFn: row => getProductQuantity(row) ?? -1,
			cell: ({row}) => {
				const product = row.original
				const currentValue = quantityDrafts[product.id] ?? quantityByProductId[product.id] ?? ''
				const parsed = Number.parseInt(currentValue || '0', 10)
				const nextQuantity = Number.isFinite(parsed) && parsed >= 0
					? parsed
					: 0
				const originalQuantity = Number.parseInt(quantityByProductId[product.id] || '0', 10)
				const dirty = nextQuantity !== originalQuantity
				const disabled = vm.updateStockMutation.isPending && pendingQuantityId === product.id

				return (
					<div
						className="relative z-10 flex items-center gap-2"
						onClick={event => {
							event.stopPropagation()
						}}
					>
						<Input
							type="number"
							min={0}
							step={1}
							value={currentValue}
							onChange={event => {
								setQuantityDrafts(current => ({
									...current,
									[product.id]: event.target.value,
								}))
							}}
							className="h-9 w-24"
							placeholder="—"
						/>
						<Button
							type="button"
							size="icon"
							variant="outline"
							className="size-9 rounded-md"
							disabled={!dirty || disabled}
							onClick={() => {
								vm.updateStockMutation.mutate({
									id: product.id,
									quantity: nextQuantity,
								}, {
									onSuccess: () => {
										setQuantityDrafts(current => {
											const next = {...current}
											delete next[product.id]
											return next
										})
									},
								})
							}}
							aria-label="Сохранить остаток"
						>
							<Check className="size-4" />
						</Button>
					</div>
				)
			},
			sortingFn: 'basic',
			meta: {
				headerClassName: 'min-w-40',
				cellClassName: 'min-w-40',
			},
		},
		{
			id: 'status',
			header: ({column}) => (
				<SortableHeader
					title="Статус"
					sorted={column.getIsSorted()}
					canSort={column.getCanSort()}
					onClick={() => {
						column.getToggleSortingHandler()?.({} as never)
					}}
				/>
			),
			accessorFn: row => row.status,
			cell: ({row}) => (
				<StatusBadge
					status={row.original.status}
					label={getProductStatusLabel(row.original.status)}
				/>
			),
		},
		{
			id: 'created_at',
			header: ({column}) => (
				<SortableHeader
					title="Создан"
					sorted={column.getIsSorted()}
					canSort={column.getCanSort()}
					onClick={() => {
						column.getToggleSortingHandler()?.({} as never)
					}}
				/>
			),
			accessorFn: row => row.created_at ?? '',
			cell: ({row}) => formatCreatedAt(row.original.created_at ?? null),
		},
		{
			id: 'actions',
			header: () => '',
			cell: ({row}) => (
				<div
					className="relative z-10 flex justify-end gap-1"
					onClick={event => {
						event.stopPropagation()
					}}
				>
					<Button
						type="button"
						size="icon"
						variant="ghost"
						className="size-9 rounded-md hover:bg-background focus-visible:bg-background"
						aria-label="Редактировать товар"
						onClick={() => {
							router.push(`/admin/products/${row.original.id}/edit`)
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
						onClick={() => {
							vm.setDeleteConfirmId(row.original.id)
						}}
					>
						<Trash2 className="size-5 text-destructive" />
					</Button>
				</div>
			),
			enableSorting: false,
			meta: {
				headerClassName: 'w-px min-w-[1%]',
				cellClassName: 'w-px min-w-[1%]',
			},
		},
	], [pendingQuantityId, quantityByProductId, quantityDrafts, router, vm])

	const table = useReactTable({
		data: vm.products,
		columns,
		state: {
			sorting,
			globalFilter,
		},
		onSortingChange: setSorting,
		onGlobalFilterChange: setGlobalFilter,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		globalFilterFn: (row, _columnId, filterValue) => {
			const query = String(filterValue).trim().toLowerCase()
			if (!query) {
				return true
			}

			const product = row.original
			const status = getProductStatusLabel(product.status).toLowerCase()
			return [
				product.title ?? '',
				product.handle ?? '',
				status,
			].some(value => value.toLowerCase().includes(query))
		},
		initialState: {
			pagination: {
				pageIndex: 0,
				pageSize: 20,
			},
		},
	})

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
			<div className="mb-6 flex flex-wrap items-end justify-between gap-4">
				<div className="flex min-w-[280px] flex-1 flex-col gap-2">
					<span className="text-sm font-medium">
						{'Поиск по товарам'}
					</span>
					<Input
						value={globalFilter}
						onChange={event => {
							setGlobalFilter(event.target.value)
							table.setPageIndex(0)
						}}
						placeholder="Название, ссылка или статус"
						className="max-w-md"
					/>
				</div>
				<p className="text-sm text-muted-foreground">
					{`Найдено: ${table.getFilteredRowModel().rows.length}`}
				</p>
			</div>
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
			<div className="mb-6 overflow-hidden rounded-lg border border-border bg-background shadow-xs">
				<div className="relative overflow-x-auto">
					{vm.loading
						? (
							<div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60">
								<span className="text-sm text-muted-foreground">
									{'Загрузка…'}
								</span>
							</div>
						)
						: null}
					<table className="w-full caption-bottom text-sm">
						<thead className="border-b border-border bg-muted/40 [&_tr]:border-b">
							{table.getHeaderGroups().map(headerGroup => (
								<tr
									key={headerGroup.id}
									className="hover:bg-transparent"
								>
									{headerGroup.headers.map(header => {
										const meta = header.column.columnDef.meta as {
											headerClassName?: string,
										} | undefined

										return (
											<th
												key={header.id}
												scope="col"
												className={cn(
													'h-11 px-3 text-left align-middle font-medium text-muted-foreground',
													meta?.headerClassName,
												)}
											>
												{header.isPlaceholder
													? null
													: flexRender(
														header.column.columnDef.header,
														header.getContext(),
													)}
											</th>
										)
									})}
								</tr>
							))}
						</thead>
						<tbody className="[&_tr:last-child]:border-0">
							{table.getRowModel().rows.length === 0 && !vm.loading
								? (
									<tr>
										<td
											colSpan={columns.length}
											className="h-24 px-3 text-center text-muted-foreground"
										>
											{'Нет товаров'}
										</td>
									</tr>
								)
								: null}
							{table.getRowModel().rows.map(row => (
								<tr
									key={row.id}
									className="cursor-pointer border-b border-border transition-colors hover:bg-muted/50"
									onClick={() => {
										router.push(`/admin/products/${row.original.id}`)
									}}
								>
									{row.getVisibleCells().map(cell => {
										const meta = cell.column.columnDef.meta as {
											cellClassName?: string,
										} | undefined

										return (
											<td
												key={cell.id}
												className={cn(
													'px-3 py-2.5 align-middle',
													meta?.cellClassName,
												)}
											>
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext(),
												)}
											</td>
										)
									})}
								</tr>
							))}
						</tbody>
					</table>
				</div>
				{table.getFilteredRowModel().rows.length > 0
					? (
						<div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-3 py-2.5">
							<p className="text-sm text-muted-foreground">
								{`Страница ${table.getState().pagination.pageIndex + 1} из ${table.getPageCount() || 1}`}
							</p>
							<div className="flex items-center gap-2">
								<Button
									type="button"
									variant="outline"
									size="icon"
									className="size-9 rounded-md"
									disabled={!table.getCanPreviousPage()}
									onClick={() => {
										table.previousPage()
									}}
								>
									<ChevronLeft className="size-4" />
								</Button>
								<Button
									type="button"
									variant="outline"
									size="icon"
									className="size-9 rounded-md"
									disabled={!table.getCanNextPage()}
									onClick={() => {
										table.nextPage()
									}}
								>
									<ChevronRight className="size-4" />
								</Button>
							</div>
						</div>
					)
					: null}
			</div>
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
