'use client'

import {Link} from './link'

export type BentoBlock = {
	bg: string
	label: string
	href: string
}

const DEFAULT_BLOCKS: BentoBlock[] = [
	{bg: '#9333ea', label: 'Акция', href: '/catalog/sale'},
	{bg: '#2563eb', label: 'Новая коллекция', href: '/catalog/new'},
	{bg: '#059669', label: 'Скидки', href: '/catalog/discounts'},
]

function getGridDimensions(count: number): {cols: number, rows: number} {
	if (count <= 1) return {cols: 1, rows: 1}
	if (count === 2) return {cols: 2, rows: 1}
	if (count <= 4) return {cols: 2, rows: 2}
	if (count === 5) return {cols: 3, rows: 2}
	return {cols: 4, rows: 2}
}

function getCellSpan(count: number, index: number): {colSpan: number, rowSpan: number} {
	if (count === 2) return {colSpan: 1, rowSpan: 1}
	if (count === 3) {
		if (index === 0) return {colSpan: 1, rowSpan: 2}
		return {colSpan: 1, rowSpan: 1}
	}
	if (count === 4) return {colSpan: 1, rowSpan: 1}
	if (count === 5) {
		if (index === 0) return {colSpan: 2, rowSpan: 1}
		return {colSpan: 1, rowSpan: 1}
	}
	if (count === 6) {
		if (index === 0 || index === 3) return {colSpan: 2, rowSpan: 1}
		return {colSpan: 1, rowSpan: 1}
	}
	if (count === 7) {
		if (index === 0) return {colSpan: 2, rowSpan: 1}
		return {colSpan: 1, rowSpan: 1}
	}
	return {colSpan: 1, rowSpan: 1}
}

type BentoBannerProps = {
	blocks?: BentoBlock[]
}

function BentoBanner({blocks = DEFAULT_BLOCKS}: BentoBannerProps) {
	const items = blocks.slice(0, 8)
	const count = Math.max(1, items.length)
	const {cols, rows} = getGridDimensions(count)

	const gridClass = [
		'grid gap-2 md:gap-3 auto-rows-fr w-full',
		cols === 1 && 'grid-cols-1',
		cols === 2 && 'grid-cols-2',
		cols === 3 && 'grid-cols-2 md:grid-cols-3',
		cols === 4 && 'grid-cols-2 md:grid-cols-4',
		rows === 1 && 'grid-rows-1',
		rows === 2 && 'grid-rows-2',
	].filter(Boolean).join(' ')

	return (
		<div className="w-full">
			<div className={gridClass}>
				{items.map((block, i) => {
					const {colSpan, rowSpan} = getCellSpan(count, i)
					const isTall = rowSpan === 2
					return (
						<Link
							key={i}
							href={block.href}
							className={`
								flex items-center justify-center min-h-[100px] md:min-h-[140px]
								rounded-none overflow-hidden
								hover:opacity-95 transition-opacity
								${isTall ? 'min-h-[220px] md:min-h-[300px]' : ''}
							`}
							style={{
								backgroundColor: block.bg,
								gridColumn: `span ${colSpan}`,
								gridRow: `span ${rowSpan}`,
							}}
						>
							<span className="text-white text-base md:text-xl font-semibold drop-shadow-md text-center px-4">
								{block.label}
							</span>
						</Link>
					)
				})}
			</div>
		</div>
	)
}

export {BentoBanner}
