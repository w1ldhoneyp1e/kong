'use client'

import {type AdminProduct} from '../../../../entities/product'
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '../../../../shared'

function formatDimension(value: number | null | undefined): string {
	if (typeof value !== 'number' || Number.isNaN(value)) {
		return '—'
	}

	return String(value)
}

function normalizeDocuments(product: AdminProduct) {
	const documents = product.metadata?.documents
	if (!Array.isArray(documents)) {
		return []
	}

	return documents.filter(document =>
		typeof document === 'object'
		&& document !== null
		&& typeof document.id === 'string'
		&& typeof document.title === 'string'
		&& typeof document.kind === 'string'
		&& typeof document.sourceType === 'string'
		&& typeof document.url === 'string')
}

function ProductMainInfoCard({product}: Readonly<{product: AdminProduct}>) {
	const tags = (product.tags ?? [])
		.map(tag => tag.value)
		.filter((value): value is string => Boolean(value && value.trim()))
	const documents = normalizeDocuments(product)

	return (
		<Card>
			<CardHeader>
				<CardTitle>
					{'Основная информация'}
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-2 text-sm">
				<p>
					<span className="font-medium text-muted-foreground">
						{'Ссылка: '}
					</span>
					{product.handle ?? '—'}
				</p>
				{product.subtitle
					? (
						<p>
							<span className="font-medium text-muted-foreground">
								{'Подзаголовок: '}
							</span>
							{product.subtitle}
						</p>
					)
					: null}
				{product.description
					? (
						<p className="whitespace-pre-wrap">
							<span className="font-medium text-muted-foreground">
								{'Описание: '}
							</span>
							{product.description}
						</p>
					)
					: null}
				<p>
					<span className="font-medium text-muted-foreground">
						{'Материал: '}
					</span>
					{product.material ?? '—'}
				</p>
				<p>
					<span className="font-medium text-muted-foreground">
						{'Вес: '}
					</span>
					{typeof product.weight === 'number' && !Number.isNaN(product.weight)
						? String(product.weight)
						: '—'}
				</p>
				<p>
					<span className="font-medium text-muted-foreground">
						{'Габариты (ДxШxВ): '}
					</span>
					{`${formatDimension(product.length)} x ${formatDimension(product.width)} x ${formatDimension(product.height)}`}
				</p>
				<p>
					<span className="font-medium text-muted-foreground">
						{'Теги: '}
					</span>
					{tags.length > 0
						? tags.join(', ')
						: '—'}
				</p>
				<div>
					<p className="font-medium text-muted-foreground">
						{'Документы:'}
					</p>
					{documents.length > 0
						? (
							<ul className="mt-1 list-disc space-y-1 pl-5">
								{documents.map(document => (
									<li key={document.id}>
										<a
											href={document.url}
											target="_blank"
											rel="noreferrer"
											className="underline"
										>
											{`${document.title} (${document.kind})`}
										</a>
									</li>
								))}
							</ul>
						)
						: (
							<p>{'—'}</p>
						)}
				</div>
			</CardContent>
		</Card>
	)
}

export {ProductMainInfoCard}
