'use client'

import Link from 'next/link'
import {
	useCallback,
	useEffect,
	useState,
} from 'react'
import {
	Button,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	getApiBase,
	Input,
	Label,
} from '../../shared'

type EditField = {
	key: string,
	label: string,
}

type AdminEntityDetailProps = {
	entity: string,
	id: string,
	title: string,
	backHref: string,
	editFields?: EditField[],
}

function renderValue(value: unknown): React.ReactNode {
	if (value === null || value === undefined) {
		return '—'
	}

	if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
		return (
			<pre className="overflow-x-auto rounded bg-muted p-2 text-xs">
				{JSON.stringify(value, null, 2)}
			</pre>
		)
	}

	if (Array.isArray(value)) {
		return (
			<pre className="overflow-x-auto rounded bg-muted p-2 text-xs">
				{JSON.stringify(value, null, 2)}
			</pre>
		)
	}

	return String(value)
}

export function AdminEntityDetail({
	entity,
	id,
	title,
	backHref,
	editFields,
}: AdminEntityDetailProps) {
	const [data, setData] = useState<Record<string, unknown> | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')
	const [editOpen, setEditOpen] = useState(false)
	const [editValues, setEditValues] = useState<Record<string, string>>({})
	const [editSubmitting, setEditSubmitting] = useState(false)
	const [editError, setEditError] = useState('')

	const load = useCallback(async () => {
		try {
			setLoading(true)
			setError('')
			const base = getApiBase()
			const res = await fetch(`${base}/${entity}/${id}`)

			if (!res.ok) {
				throw new Error(`${res.status} ${res.statusText}`)
			}

			const json = await res.json()

			let payload = typeof json === 'object' && json !== null
				? json
				: {}
			if (payload && !Array.isArray(payload) && typeof payload === 'object') {
				const values = Object.values(payload)
				const single = values.length === 1 && values[0] && typeof values[0] === 'object' && !Array.isArray(values[0])
					? values[0] as Record<string, unknown>
					: null
				if (single) {
					payload = single
				}
			}

			setData(payload as Record<string, unknown>)
		}
		catch (e) {
			setError(e instanceof Error
				? e.message
				: 'Ошибка загрузки')
		}
		finally {
			setLoading(false)
		}
	}, [entity, id])

	useEffect(() => {
		load()
	}, [load])

	useEffect(() => {
		if (data && editFields?.length) {
			const vals: Record<string, string> = {}
			for (const f of editFields) {
				const v = data[f.key]
				vals[f.key] = v === null || v === undefined
					? ''
					: String(v)
			}
			setEditValues(vals)
		}
	}, [data, editFields])

	const handleEdit = async (ev: React.FormEvent) => {
		ev.preventDefault()
		if (!editFields?.length) {
			return
		}

		setEditSubmitting(true)
		setEditError('')
		try {
			const body: Record<string, unknown> = {id}
			for (const f of editFields) {
				body[f.key] = editValues[f.key] ?? ''
			}

			const base = getApiBase()
			const res = await fetch(`${base}/${entity}/${id}`, {
				method: 'PUT',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify(body),
			})

			if (!res.ok) {
				const err = await res.json().catch(() => ({}))
				throw new Error((err as {error?: string}).error ?? `${res.status}`)
			}

			setEditOpen(false)
			await load()
		}
		catch (err) {
			setEditError(err instanceof Error
				? err.message
				: 'Ошибка сохранения')
		}
		finally {
			setEditSubmitting(false)
		}
	}

	if (loading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>{title}</CardTitle>
					<CardDescription>{'Загрузка...'}</CardDescription>
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
					<CardDescription>{'Ошибка'}</CardDescription>
				</CardHeader>
				<CardContent>
					<p className="text-destructive py-4">{error}</p>
					<Link
						href={backHref}
						className="text-primary hover:underline"
					>
						{'← Назад к списку'}
					</Link>
				</CardContent>
			</Card>
		)
	}

	if (!data || Object.keys(data).length === 0) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>{title}</CardTitle>
					<CardDescription>{'Нет данных'}</CardDescription>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground py-8 text-center">
						{'Нет данных'}
					</p>
					<Link
						href={backHref}
						className="text-primary hover:underline"
					>
						{'← Назад к списку'}
					</Link>
				</CardContent>
			</Card>
		)
	}

	const entries = Object.entries(data).filter(
		([, v]) => v !== undefined,
	)

	return (
		<div className="space-y-4">
			{editFields?.length
				? (
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle>{'Редактировать'}</CardTitle>
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={() => setEditOpen(v => !v)}
							>
								{editOpen
									? 'Скрыть'
									: 'Показать форму'}
							</Button>
						</CardHeader>
						{editOpen && (
							<CardContent>
								<form
									onSubmit={handleEdit}
									className="space-y-4"
								>
									{editError && (
										<p className="text-destructive text-sm">{editError}</p>
									)}
									{editFields.map(f => (
										<div key={f.key}>
											<Label htmlFor={`edit-${f.key}`}>{f.label}</Label>
											<Input
												id={`edit-${f.key}`}
												value={editValues[f.key] ?? ''}
												onChange={e => setEditValues(prev => ({
													...prev,
													[f.key]: e.target.value,
												}))}
												className="mt-1"
											/>
										</div>
									))}
									<Button
										type="submit"
										disabled={editSubmitting}
									>
										{editSubmitting
											? 'Сохранение...'
											: 'Сохранить'}
									</Button>
								</form>
							</CardContent>
						)}
					</Card>
				)
				: null}
			<Card>
				<CardHeader>
					<div className="flex items-center gap-2">
						<Link
							href={backHref}
							className="text-muted-foreground hover:text-foreground text-sm"
						>
							{'← Назад'}
						</Link>
					</div>
					<CardTitle>{title}</CardTitle>
					<CardDescription>{'ID: '}{id}</CardDescription>
				</CardHeader>
				<CardContent>
					<dl className="grid gap-4 sm:grid-cols-1">
						{entries.map(([key, value]) => (
							<div
								key={key}
								className="border-b pb-4"
							>
								<dt className="text-muted-foreground text-sm font-medium">
									{key}
								</dt>
								<dd className="mt-1 break-words text-sm">
									{renderValue(value)}
								</dd>
							</div>
						))}
					</dl>
				</CardContent>
			</Card>
		</div>
	)
}
