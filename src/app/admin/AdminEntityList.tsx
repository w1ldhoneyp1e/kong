'use client'

import {
useCallback,
useEffect,
useState
} from 'react';
import {Link,
	Button,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	Input,
	Label,
,getApiBase} from '../../shared'

type Column = {key: string,
label: string}

type CreateField = {
 key: string,
label: string,
required?: boolean}

type AdminEntityListProps = {
	title: string,
	description?: string,
	apiPath: string,
	basePath: string,
	columns: Column[],
	createFields?: CreateField[],
}

function getNested(obj: unknown, path: string): unknown {
	const keys = path.split('.')

	let current: unknown = obj
	for (const key of keys) {
		if (current === null || current === undefined) {
			return undefined
		}

		current = (current as Record<string, unknown>)[key]
	}

	return current
}

function cellValue(value: unknown): string {
	if (value === null || value === undefined) {
		return '—'
	}

	if (typeof value === 'object') {
		return JSON.stringify(value).slice(0, 80)
	}

	return String(value)
}

export function AdminEntityList({
	title,
	description,
	apiPath,
	basePath,
	columns,
	createFields,
}: AdminEntityListProps) {
	const [items, setItems] = useState<Record<string, unknown>[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')
	const [refreshKey, setRefreshKey] = useState(0)
	const [createOpen, setCreateOpen] = useState(false)
	const [createValues, setCreateValues] = useState<Record<string, string>>({})
	const [createSubmitting, setCreateSubmitting] = useState(false)
	const [createError, setCreateError] = useState('')
	const [deletingId, setDeletingId] = useState<string | null>(null)

	const load = useCallback(async () => {
		try {
			setLoading(true)
			setError('')
			const base = getApiBase()
			const path = apiPath.startsWith('/')
? apiPath.slice(1)
: apiPath
			const res = await fetch(`${base}/${path}`)

			if (!res.ok) {
				throw new Error(`${res.status} ${res.statusText}`)
			}

			const data = await res.json()

			let list: Record<string, unknown>[] = []
			if (Array.isArray(data)) {
				list = data
			}
			else if (data && typeof data === 'object') {
				const firstArray = Object.values(data).find(
					(v): v is unknown[] => Array.isArray(v),
				)
				list = (firstArray ?? []) as Record<string, unknown>[]
			}

			setItems(list)
		}
		catch (e) {
			setError(e instanceof Error
? e.message
: 'Ошибка загрузки')
		}
		finally {
			setLoading(false)
		}
	}, [apiPath])

	useEffect(() => {
		load()
	}, [load, refreshKey])

	const handleCreate = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!createFields?.length) {return}

		const body: Record<string, unknown> = {}
		for (const f of createFields) {
			const v = createValues[f.key] ?? ''
			if (f.required && !v.trim()) {
				setCreateError(`Заполни: ${f.label}`)
				return
			}
			body[f.key] = v.trim() || undefined
		}

		setCreateSubmitting(true)
		setCreateError('')
		try {
			const base = getApiBase()
			const path = apiPath.startsWith('/')
? apiPath.slice(1)
: apiPath
			const res = await fetch(`${base}/${path}`, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify(body),
			})

			if (!res.ok) {
				const err = await res.json().catch(() => ({}))
				throw new Error((err as {error?: string}).error ?? `${res.status}`)
			}

			setCreateValues({})
			setCreateOpen(false)
			setRefreshKey(k => k + 1)
		}
		catch (e) {
			setCreateError(e instanceof Error
? e.message
: 'Ошибка создания')
		}
		finally {
			setCreateSubmitting(false)
		}
	}

	const handleDelete = async (id: string) => {
		// eslint-disable-next-line no-alert -- подтверждение в админке
		if (!confirm('Удалить запись?')) {return}

		setDeletingId(id)
		try {
			const base = getApiBase()
			const path = apiPath.startsWith('/')
? apiPath.slice(1)
: apiPath
			const res = await fetch(`${base}/${path}/${id}`, {method: 'DELETE'})

			if (!res.ok) {
				throw new Error(`${res.status}`)
			}

			setRefreshKey(k => k + 1)
		}
		catch {
			setError('Ошибка удаления')
		}
		finally {
			setDeletingId(null)
		}
	}

	if (loading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>{title}</CardTitle>
					{description && <CardDescription>{description}</CardDescription>}
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground py-8 text-center">
						{'Загрузка...'}
					</p>
				</CardContent>
			</Card>
		)
	}

	if (error) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>{title}</CardTitle>
					{description && <CardDescription>{description}</CardDescription>}
				</CardHeader>
				<CardContent>
					<p className="text-destructive py-4">{error}</p>
				</CardContent>
			</Card>
		)
	}

	return (
		<div className="space-y-4">
			{createFields?.length
				? (
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle>{'Создать'}</CardTitle>
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={() => setCreateOpen(v => !v)}
							>
								{createOpen
? 'Скрыть'
: 'Показать форму'}
							</Button>
						</CardHeader>
						{createOpen && (
							<CardContent>
								<form onSubmit={handleCreate}
className="space-y-4">
									{createError && (
										<p className="text-destructive text-sm">{createError}</p>
									)}
									{createFields.map(f => (
										<div key={f.key}>
											<Label htmlFor={`create-${f.key}`}>{f.label}</Label>
											<Input
												id={`create-${f.key}`}
												value={createValues[f.key] ?? ''}
												onChange={e => setCreateValues(prev => ({...prev,
[f.key]: e.target.value}))}
												className="mt-1"
											/>
										</div>
									))}
									<Button type="submit"
disabled={createSubmitting}>
										{createSubmitting
? 'Создаём...'
: 'Создать'}
									</Button>
								</form>
							</CardContent>
						)}
					</Card>
				)
				: null}
			<Card>
				<CardHeader>
					<CardTitle>{title}</CardTitle>
					<CardDescription>
						{description ?? `Записей: ${items.length}`}
					</CardDescription>
				</CardHeader>
				<CardContent>
					{items.length === 0
						? (
							<p className="text-muted-foreground py-8 text-center">
								{'Нет записей'}
							</p>
						)
						: (
							<div className="overflow-x-auto">
								<table className="w-full text-sm">
									<thead>
										<tr className="border-b">
											{columns.map(col => (
												<th
													key={col.key}
													className="text-left font-medium p-2"
												>
													{col.label}
												</th>
											))}
											<th className="w-32 p-2" />
										</tr>
									</thead>
									<tbody>
										{items.map((item, i) => (
											<tr key={(item.id as string) ?? i}
className="border-b">
												{columns.map(col => (
													<td key={col.key}
className="p-2">
														{cellValue(getNested(item, col.key))}
													</td>
												))}
												<td className="p-2 flex gap-2">
													{typeof item.id === 'string' && (
														<>
															<Link
																href={`${basePath}/${item.id}`}
																className="text-primary hover:underline"
															>
																{'Подробнее'}
															</Link>
															<Button
																type="button"
																variant="destructive"
																size="sm"
																disabled={deletingId === item.id}
																onClick={() => handleDelete(item.id as string)}
															>
																{deletingId === item.id
? '...'
: 'Удалить'}
															</Button>
														</>
													)}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						)}
				</CardContent>
			</Card>
		</div>
	)
}
