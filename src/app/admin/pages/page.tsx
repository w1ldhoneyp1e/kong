'use client'

import {useEffect, useMemo, useState} from 'react'
import {contentPageApi, type ContentPage} from '../../../entities/content-page'
import {
	Button,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '../../../shared'

type FormState = {
	title: string,
	description: string,
	body: string,
}

function toFormState(page: ContentPage | null): FormState {
	return {
		title: page?.title ?? '',
		description: page?.description ?? '',
		body: page?.body ?? '',
	}
}

export default function AdminPagesPage() {
	const [pages, setPages] = useState<ContentPage[]>([])
	const [selectedSlug, setSelectedSlug] = useState<string>('about')
	const [form, setForm] = useState<FormState>({
		title: '',
		description: '',
		body: '',
	})
	const [loading, setLoading] = useState(true)
	const [saving, setSaving] = useState(false)
	const [message, setMessage] = useState('')
	const [error, setError] = useState('')

	useEffect(() => {
		contentPageApi.listPages()
			.then(data => {
				setPages(data)
				const initial = data.find(page => page.slug === 'about') ?? data[0] ?? null
				setSelectedSlug(initial?.slug ?? 'about')
				setForm(toFormState(initial))
			})
			.catch(cause => {
				setError(cause instanceof Error
					? cause.message
					: 'Не удалось загрузить страницы')
			})
			.finally(() => {
				setLoading(false)
			})
	}, [])

	const selectedPage = useMemo(
		() => pages.find(page => page.slug === selectedSlug) ?? null,
		[pages, selectedSlug],
	)

	const selectPage = (slug: string) => {
		const page = pages.find(item => item.slug === slug) ?? null
		setSelectedSlug(slug)
		setForm(toFormState(page))
		setMessage('')
		setError('')
	}

	const handleSave = async (event: React.FormEvent) => {
		event.preventDefault()
		if (!selectedSlug) {
			return
		}

		setSaving(true)
		setMessage('')
		setError('')

		try {
			const updated = await contentPageApi.updatePage(selectedSlug, {
				title: form.title.trim(),
				description: form.description.trim() || null,
				body: form.body,
			})
			setPages(current => current.map(page => page.slug === updated.slug
				? updated
				: page))
			setForm(toFormState(updated))
			setMessage('Страница сохранена')
		}
		catch (cause) {
			setError(cause instanceof Error
				? cause.message
				: 'Не удалось сохранить страницу')
		}
		finally {
			setSaving(false)
		}
	}

	return (
		<div className="flex flex-col gap-6">
			<div>
				<h1 className="heading-4">{'Страницы сайта'}</h1>
				<p className="mt-1 text-sm text-muted-foreground">
					{'Редактирование контентных страниц вроде "О нас" и "Контакты".'}
				</p>
			</div>

			{error
				? (
					<div className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
						{error}
					</div>
				)
				: null}
			{message
				? (
					<div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
						{message}
					</div>
				)
				: null}

			<div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
				<Card>
					<CardHeader>
						<CardTitle>{'Разделы'}</CardTitle>
						<CardDescription>{'Пока управляем фиксированными страницами первого релиза.'}</CardDescription>
					</CardHeader>
					<CardContent className="space-y-2">
						{loading && <p className="text-sm text-muted-foreground">{'Загрузка...'}</p>}
						{!loading && pages.map(page => (
							<Button
								key={page.id}
								type="button"
								variant={page.slug === selectedSlug
									? 'default'
									: 'outline'}
								className="w-full justify-start"
								onClick={() => {
									selectPage(page.slug)
								}}
							>
								{page.title}
							</Button>
						))}
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>{selectedPage?.title ?? 'Страница'}</CardTitle>
						<CardDescription>{selectedPage?.slug ? `slug: ${selectedPage.slug}` : 'Выбери страницу слева'}</CardDescription>
					</CardHeader>
					<CardContent>
						<form
							onSubmit={handleSave}
							className="space-y-4"
						>
							<div className="space-y-2">
								<label
									htmlFor="cms-page-title"
									className="text-sm font-medium"
								>
									{'Заголовок'}
								</label>
								<input
									id="cms-page-title"
									className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
									value={form.title}
									onChange={event => {
										setForm(current => ({
											...current,
											title: event.target.value,
										}))
									}}
									disabled={!selectedPage || saving}
								/>
							</div>

							<div className="space-y-2">
								<label
									htmlFor="cms-page-description"
									className="text-sm font-medium"
								>
									{'Описание'}
								</label>
								<textarea
									id="cms-page-description"
									className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
									value={form.description}
									onChange={event => {
										setForm(current => ({
											...current,
											description: event.target.value,
										}))
									}}
									disabled={!selectedPage || saving}
								/>
							</div>

							<div className="space-y-2">
								<label
									htmlFor="cms-page-body"
									className="text-sm font-medium"
								>
									{'Содержимое'}
								</label>
								<textarea
									id="cms-page-body"
									className="min-h-64 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
									value={form.body}
									onChange={event => {
										setForm(current => ({
											...current,
											body: event.target.value,
										}))
									}}
									disabled={!selectedPage || saving}
								/>
								<p className="text-xs text-muted-foreground">
									{'Сейчас каждая новая строка на витрине показывается как отдельный абзац.'}
								</p>
							</div>

							<div className="flex justify-end">
								<Button
									type="submit"
									state={saving
										? 'loading'
										: 'default'}
									disabled={!selectedPage}
								>
									{'Сохранить страницу'}
								</Button>
							</div>
						</form>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
