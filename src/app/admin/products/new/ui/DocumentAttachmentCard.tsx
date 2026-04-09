'use client'

import {
	Archive,
	File,
	FileCode,
	FileText,
	Image,
	Music,
	Presentation,
	Table2,
	Trash2,
	Video,
} from 'lucide-react'
import {Button, cn} from '../../../../../shared'
import {type ProductDocument} from '../types'

type DocumentFormatKey =
	| 'pdf'
	| 'word'
	| 'excel'
	| 'powerpoint'
	| 'image'
	| 'archive'
	| 'video'
	| 'audio'
	| 'code'
	| 'text'
	| 'unknown'

function extractExtensionFromUrl(url: string): string {
	const trimmed = url.trim()
	if (!trimmed) {
		return ''
	}

	try {
		const parsed = new URL(trimmed)
		const segment = parsed.pathname.split('/').pop() ?? ''

		return segment.includes('.')
			? (segment.split('.').pop()
				?.toLowerCase() ?? '')
			: ''
	}
	catch {
		const segment = trimmed.split('/').pop() ?? ''
		if (!segment.includes('.')) {
			return ''
		}

		return segment.split('.').pop()
			?.toLowerCase() ?? ''
	}
}

function inferDocumentFormatFromUrl(url: string): DocumentFormatKey {
	const ext = extractExtensionFromUrl(url)

	if (ext === 'pdf') {
		return 'pdf'
	}

	if (ext === 'doc' || ext === 'docx' || ext === 'odt') {
		return 'word'
	}

	if (ext === 'xls' || ext === 'xlsx' || ext === 'csv' || ext === 'ods') {
		return 'excel'
	}

	if (ext === 'ppt' || ext === 'pptx' || ext === 'odp') {
		return 'powerpoint'
	}

	if (
		ext === 'png'
		|| ext === 'jpg'
		|| ext === 'jpeg'
		|| ext === 'gif'
		|| ext === 'webp'
		|| ext === 'svg'
		|| ext === 'bmp'
		|| ext === 'ico'
	) {
		return 'image'
	}

	if (ext === 'zip' || ext === 'rar' || ext === '7z' || ext === 'tar' || ext === 'gz' || ext === 'tgz') {
		return 'archive'
	}

	if (ext === 'mp4' || ext === 'webm' || ext === 'mov' || ext === 'mkv' || ext === 'avi') {
		return 'video'
	}

	if (ext === 'mp3' || ext === 'wav' || ext === 'ogg' || ext === 'flac' || ext === 'm4a') {
		return 'audio'
	}

	if (
		ext === 'js'
		|| ext === 'ts'
		|| ext === 'tsx'
		|| ext === 'jsx'
		|| ext === 'html'
		|| ext === 'css'
		|| ext === 'json'
		|| ext === 'xml'
		|| ext === 'yaml'
		|| ext === 'yml'
	) {
		return 'code'
	}

	if (ext === 'txt' || ext === 'md' || ext === 'rtf') {
		return 'text'
	}

	return 'unknown'
}

const FORMAT_VISUAL: Record<
	DocumentFormatKey,
	{
		Icon: typeof File,
		iconClass: string,
		panelClass: string,
		badge: string,
	}
> = {
	pdf: {
		Icon: FileText,
		iconClass: 'text-red-600',
		panelClass: 'bg-red-500/12',
		badge: 'PDF',
	},
	word: {
		Icon: FileText,
		iconClass: 'text-blue-700',
		panelClass: 'bg-blue-600/12',
		badge: 'DOC',
	},
	excel: {
		Icon: Table2,
		iconClass: 'text-emerald-700',
		panelClass: 'bg-emerald-600/12',
		badge: 'XLS',
	},
	powerpoint: {
		Icon: Presentation,
		iconClass: 'text-orange-700',
		panelClass: 'bg-orange-500/12',
		badge: 'PPT',
	},
	image: {
		Icon: Image,
		iconClass: 'text-violet-700',
		panelClass: 'bg-violet-500/12',
		badge: 'IMG',
	},
	archive: {
		Icon: Archive,
		iconClass: 'text-amber-800',
		panelClass: 'bg-amber-500/12',
		badge: 'ZIP',
	},
	video: {
		Icon: Video,
		iconClass: 'text-pink-700',
		panelClass: 'bg-pink-500/12',
		badge: 'Видео',
	},
	audio: {
		Icon: Music,
		iconClass: 'text-indigo-700',
		panelClass: 'bg-indigo-500/12',
		badge: 'Аудио',
	},
	code: {
		Icon: FileCode,
		iconClass: 'text-slate-700',
		panelClass: 'bg-slate-500/12',
		badge: 'CODE',
	},
	text: {
		Icon: FileText,
		iconClass: 'text-muted-foreground',
		panelClass: 'bg-muted',
		badge: 'TXT',
	},
	unknown: {
		Icon: File,
		iconClass: 'text-muted-foreground',
		panelClass: 'bg-muted',
		badge: 'FILE',
	},
}

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
	const format = inferDocumentFormatFromUrl(document.url)
	const visual = FORMAT_VISUAL[format]
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
