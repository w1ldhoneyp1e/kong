'use client'

import {Trash2} from 'lucide-react'
import {Button, cn} from '../../../shared'
import {type ProductDocument} from '../types'
import {getDocumentFormatVisual, inferDocumentFormatFromUrl} from './documentAttachmentFormat'

function DocumentAttachmentCard({
	document,
	kindLabel,
	sourceLabel,
	disabled,
	onRemove,
}: Readonly<{
	document: ProductDocument,
	kindLabel: string,
	sourceLabel: string,
	disabled: boolean,
	onRemove: () => void,
}>) {
	const visual = getDocumentFormatVisual(document.url)
	const {Icon} = visual

	return (
		<div
			className={cn(
				'group relative flex min-h-[8.5rem] flex-col overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-shadow',
				'hover:shadow-md',
			)}
		>
			<Button
				type="button"
				variant="ghost"
				size="icon-sm"
				className="absolute right-0.5 top-0.5 z-10 size-7 opacity-70 hover:opacity-100"
				disabled={disabled}
				aria-label="Удалить документ"
				onClick={onRemove}
			>
				<Trash2 className="size-3.5" />
			</Button>
			<div className="flex flex-1 flex-col items-center px-2 pb-1.5 pt-5">
				<div
					className={cn(
						'mb-2 flex h-14 w-12 shrink-0 items-center justify-center rounded-md',
						visual.panelClass,
					)}
				>
					<Icon
						className={cn('size-9 stroke-[1.25]', visual.iconClass)}
						aria-hidden={true}
					/>
				</div>
				<span
					className="mb-0.5 rounded px-1 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-muted-foreground"
				>
					{visual.badge}
				</span>
				<div className="w-full text-center">
					<div className="line-clamp-2 min-h-[2.25rem] text-xs font-medium leading-snug">
						{document.title}
					</div>
					<div className="mt-1 text-[11px] text-muted-foreground leading-tight">
						{`${kindLabel} · ${sourceLabel}`}
					</div>
				</div>
			</div>
			<div
				className="border-t bg-muted/30 px-1.5 py-1 text-[10px] text-muted-foreground"
				title={document.url}
			>
				<p className="truncate font-mono">
					{document.url}
				</p>
			</div>
		</div>
	)
}

export {
	inferDocumentFormatFromUrl,
	DocumentAttachmentCard,
}
