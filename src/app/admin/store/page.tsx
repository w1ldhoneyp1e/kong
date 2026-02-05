'use client'

import {useEffect, useState} from 'react'
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
} from '../../../shared'

function renderValue(value: unknown): string {
	if (value === null || value === undefined) {
		return '—'
	}

	if (typeof value === 'object') {
		return JSON.stringify(value)
	}

	return String(value)
}

export default function AdminStorePage() {
	const [store, setStore] = useState<Record<string, unknown> | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')
	const [editOpen, setEditOpen] = useState(false)
	const [editName, setEditName] = useState('')
	const [editSubmitting, setEditSubmitting] = useState(false)
	const [editError, setEditError] = useState('')

	useEffect(() => {
		let cancelled = false

		async function load() {
			try {
				setLoading(true)
				setError('')
				const base = getApiBase()
				const res = await fetch(`${base}/store`)

				if (!res.ok) {
					throw new Error(`${res.status} ${res.statusText}`)
				}

				const data = await res.json()

				if (!cancelled) {
					setStore(data.store ?? data ?? null)
				}
			}
			catch (e) {
				if (!cancelled) {
					setError(e instanceof Error
						? e.message
						: 'Ошибка загрузки')
				}
			}
			finally {
				if (!cancelled) {
					setLoading(false)
				}
			}
		}

		load()

		return () => {
			cancelled = true
		}
	}, [])

	useEffect(() => {
		if (store && typeof store.name === 'string') {
			setEditName(store.name)
		}
	}, [store])

	const handleEdit = async (ev: React.FormEvent) => {
		ev.preventDefault()
		setEditSubmitting(true)
		setEditError('')
		try {
			const base = getApiBase()
			const res = await fetch(`${base}/store`, {
				method: 'PUT',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({name: editName}),
			})

			if (!res.ok) {
				const err = await res.json().catch(() => ({}))
				throw new Error((err as {error?: string}).error ?? `${res.status}`)
			}

			setEditOpen(false)
			setStore(prev => prev
				? {
					...prev,
					name: editName,
				}
				: null)
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
					<CardTitle>{'Магазин'}</CardTitle>
					<CardDescription>{'Данные магазина'}</CardDescription>
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
					<CardTitle>{'Магазин'}</CardTitle>
					<CardDescription>{'Данные магазина'}</CardDescription>
				</CardHeader>
				<CardContent>
					<p className="text-destructive py-4">{error}</p>
				</CardContent>
			</Card>
		)
	}

	if (!store) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>{'Магазин'}</CardTitle>
					<CardDescription>{'Данные магазина'}</CardDescription>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground py-8 text-center">
						{'Нет данных'}
					</p>
				</CardContent>
			</Card>
		)
	}

	const entries = Object.entries(store).filter(
		([, v]) => v !== undefined && v !== null,
	)

	return (
		<div className="space-y-4">
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
							<div>
								<Label htmlFor="store-name">{'Название'}</Label>
								<Input
									id="store-name"
									value={editName}
									onChange={e => setEditName(e.target.value)}
									className="mt-1"
								/>
							</div>
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
			<Card>
				<CardHeader>
					<CardTitle>{'Магазин'}</CardTitle>
					<CardDescription>{'Данные магазина'}</CardDescription>
				</CardHeader>
				<CardContent>
					<dl className="grid gap-2 sm:grid-cols-2">
						{entries.map(([key, value]) => (
							<div
								key={key}
								className="border-b pb-2"
							>
								<dt className="text-muted-foreground text-sm font-medium">
									{key}
								</dt>
								<dd className="mt-0.5 break-all text-sm">
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
