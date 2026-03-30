'use client'

import {ChevronDown, ChevronUp} from 'lucide-react'
import * as React from 'react'
import {cn} from '../lib/utils'
import {Button} from './button'

type DataTableColumn<T> = {
	id: string,
	header: React.ReactNode,
	sortKey?: string,
	className?: string,
	align?: 'left' | 'center' | 'right',
	cell: (row: T) => React.ReactNode,
}

type DataTablePagination = {
	page: number,
	pageSize: number,
	total: number,
	onPageChange: (page: number) => void,
}

type DataTableSort = {
	key: string,
	dir: 'asc' | 'desc',
	onChange: (key: string, dir: 'asc' | 'desc') => void,
}

type DataTableProps<T> = Readonly<{
	columns: DataTableColumn<T>[],
	data: T[],
	getRowKey: (row: T) => string,
	loading?: boolean,
	emptyLabel?: string,
	onRowClick?: (row: T) => void,
	actions?: (row: T) => React.ReactNode,
	pagination?: DataTablePagination,
	sort?: DataTableSort,
	className?: string,
}>

function alignClass(align: DataTableColumn<unknown>['align']): string {
	if (align === 'right') {
		return 'text-right'
	}

	if (align === 'center') {
		return 'text-center'
	}

	return 'text-left'
}

function DataTable<T>({
	columns,
	data,
	getRowKey,
	loading = false,
	emptyLabel = 'Нет данных',
	onRowClick,
	actions,
	pagination,
	sort,
	className,
}: DataTableProps<T>) {
	const hasActions = typeof actions === 'function'
	const totalPages = pagination
		? Math.max(
			1,
			Math.ceil(pagination.total / pagination.pageSize),
		)
		: 1

	return (
		<div
			className={cn(
				'overflow-hidden rounded-lg border border-border bg-background shadow-xs',
				className,
			)}
		>
			<div className="relative overflow-x-auto">
				{loading
					? (
						<div
							className="absolute inset-0 z-10 flex items-center justify-center bg-background/60"
							aria-busy="true"
						>
							<span className="text-sm text-muted-foreground">
								{'Загрузка…'}
							</span>
						</div>
					)
					: null}
				<table className="w-full caption-bottom text-sm">
					<thead className="border-b border-border bg-muted/40 [&_tr]:border-b">
						<tr className="hover:bg-transparent">
							{columns.map(col => {
								const canSort = Boolean(sort && col.sortKey)
								const isActive = sort?.key === col.sortKey
								const sortDir = isActive
									? sort?.dir
									: undefined

								return (
									<th
										key={col.id}
										scope="col"
										className={cn(
											'h-11 px-3 text-left align-middle font-medium text-muted-foreground',
											alignClass(col.align),
											col.className,
										)}
									>
										{canSort && col.sortKey
											? (
												<button
													type="button"
													className={cn(
														'inline-flex items-center gap-1 rounded-md px-1 py-0.5 -mx-1',
														'hover:bg-muted/80 hover:text-foreground',
														'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
													)}
													onClick={() => {
														if (!sort || !col.sortKey) {
															return
														}

														if (sort.key === col.sortKey) {
															sort.onChange(
																col.sortKey,
																sort.dir === 'asc'
																	? 'desc'
																	: 'asc',
															)
														}
														else {
															sort.onChange(col.sortKey, 'asc')
														}
													}}
												>
													<span>
														{col.header}
													</span>
													{isActive && sortDir === 'asc'
														? <ChevronUp className="size-4 opacity-70" />
														: null}
													{isActive && sortDir === 'desc'
														? <ChevronDown className="size-4 opacity-70" />
														: null}
												</button>
											)
											: col.header}
									</th>
								)
							})}
							{hasActions
								? (
									<th
										scope="col"
										className="h-11 w-px min-w-[1%] px-3 text-right align-middle font-medium text-muted-foreground"
									>
										{' '}
									</th>
								)
								: null}
						</tr>
					</thead>
					<tbody className="[&_tr:last-child]:border-0">
						{data.length === 0 && !loading
							? (
								<tr>
									<td
										colSpan={columns.length + (hasActions
											? 1
											: 0)}
										className="h-24 px-3 text-center text-muted-foreground"
									>
										{emptyLabel}
									</td>
								</tr>
							)
							: null}
						{data.map(row => {
							const key = getRowKey(row)
							const clickable = typeof onRowClick === 'function'

							return (
								<tr
									key={key}
									className={cn(
										'border-b border-border transition-colors',
										clickable && 'cursor-pointer hover:bg-muted/50',
									)}
									onClick={clickable
										? () => {
											onRowClick?.(row)
										}
										: undefined}
								>
									{columns.map(col => (
										<td
											key={`${key}-${col.id}`}
											className={cn(
												'px-3 py-2.5 align-middle',
												alignClass(col.align),
												col.className,
											)}
										>
											{col.cell(row)}
										</td>
									))}
									{hasActions
										? (
											<td className="px-3 py-2.5 text-right align-middle">
												{actions?.(row)}
											</td>
										)
										: null}
								</tr>
							)
						})}
					</tbody>
				</table>
			</div>
			{pagination && pagination.total > 0
				? (
					<div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-3 py-2.5">
						<p className="text-sm text-muted-foreground">
							{`Страница ${pagination.page} из ${totalPages}`}
						</p>
						<div className="flex gap-2">
							<Button
								type="button"
								variant="outline"
								size="sm"
								disabled={pagination.page <= 1}
								onClick={() => {
									pagination.onPageChange(pagination.page - 1)
								}}
							>
								{'Назад'}
							</Button>
							<Button
								type="button"
								variant="outline"
								size="sm"
								disabled={pagination.page >= totalPages}
								onClick={() => {
									pagination.onPageChange(pagination.page + 1)
								}}
							>
								{'Вперёд'}
							</Button>
						</div>
					</div>
				)
				: null}
		</div>
	)
}

export type {
	DataTableColumn,
	DataTablePagination,
	DataTableSort,
}
export {DataTable}
