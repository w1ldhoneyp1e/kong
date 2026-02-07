'use client'

import {ChevronRight} from 'lucide-react'
import {
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react'
import {type CategoryTreeNode} from '../../../entities/category'
import {
	cn,
	Select,
	SelectClearButton,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../../../shared'
import {collectAllIds, getVisibleNodes} from './utils'

const PARENT_NONE_VALUE = '__none__'

type ParentCategorySelectProps = {
	parentId: string | null,
	parentTree: CategoryTreeNode[],
	onParentIdChange: (value: string | null) => void,
	highlightParentField?: boolean,
}

function ParentCategorySelect({
	parentId,
	parentTree,
	onParentIdChange,
	highlightParentField = false,
}: ParentCategorySelectProps) {
	const [expandedIds, setExpandedIds] = useState<Set<string>>(() => collectAllIds(parentTree))
	const [parentSelectOpen, setParentSelectOpen] = useState(false)
	const chevronClickRef = useRef(false)
	useEffect(() => {
		setExpandedIds(collectAllIds(parentTree))
	}, [parentTree])
	const visibleNodes = useMemo(
		() => getVisibleNodes(parentTree, expandedIds),
		[parentTree, expandedIds],
	)

	const toggleExpand = (id: string) => {
		setExpandedIds(prev => {
			const next = new Set(prev)
			if (next.has(id)) {
				next.delete(id)
			}
			else {
				next.add(id)
			}
			return next
		})
	}

	return (
		<div
			className={cn(
				'flex h-9 w-full items-center overflow-hidden rounded-md border border-input transition-[box-shadow,background-color] duration-300',
				highlightParentField && 'ring-2 ring-[var(--color-brand)]/50 bg-[var(--color-brand)]/12',
			)}
		>
			<Select
				open={parentSelectOpen}
				onOpenChange={open => {
					if (!open && chevronClickRef.current) {
						chevronClickRef.current = false
						setParentSelectOpen(true)
						return
					}
					setParentSelectOpen(open)
				}}
				value={parentId ?? PARENT_NONE_VALUE}
				onValueChange={v => {
					if (chevronClickRef.current) {
						return
					}
					onParentIdChange(v === PARENT_NONE_VALUE
						? null
						: v)
				}}
			>
				<SelectTrigger
					className={parentId
						? 'flex-1 rounded-none border-0 border-r border-input focus:ring-0 data-[state=open]:rounded-none'
						: 'flex-1 rounded-r-md border-0 focus:ring-0'}
				>
					<SelectValue placeholder="Без родителя" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem
						value={PARENT_NONE_VALUE}
						indicator="background"
					>
						{'Без родителя'}
					</SelectItem>
					{visibleNodes.map(({node, depth}) => {
						const hasChildren = node.children.length > 0
						const isExpanded = expandedIds.has(node.id)
						const showChevron = parentSelectOpen && hasChildren
						return (
							<SelectItem
								key={node.id}
								value={node.id}
								indicator="background"
								style={{
									paddingLeft: 28 + depth * 12,
								}}
							>
								<span className="flex items-center gap-1.5 min-w-0">
									{showChevron
										? (
											<button
												type="button"
												aria-expanded={isExpanded}
												onPointerDownCapture={() => {
													chevronClickRef.current = true
													toggleExpand(node.id)
												}}
												className="flex-shrink-0 p-0.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
											>
												<ChevronRight
													className={cn(
														'size-4 transition-transform',
														isExpanded && 'rotate-90',
													)}
												/>
											</button>
										)
										: (
											<span
												className="inline-block w-5 flex-shrink-0"
												aria-hidden={true}
											/>
										)}
									<span className="truncate">
										{node.name}
									</span>
								</span>
							</SelectItem>
						)
					})}
				</SelectContent>
			</Select>
			{parentId
				? (
					<SelectClearButton
						onClick={() => onParentIdChange(null)}
						aria-label="Снять выбор"
					/>
				)
				: null}
		</div>
	)
}

export {ParentCategorySelect}
export type {ParentCategorySelectProps}
