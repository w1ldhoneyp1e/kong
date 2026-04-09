'use client'

import {ChevronDown} from 'lucide-react'
import {cn, Collapse} from '../../../../../shared'
import {ProductSpecsFields} from '../../ui/ProductSpecsFields'
import {useProductCreateVm} from '../viewmodel'

function SpecsSection() {
	const {specs} = useProductCreateVm()

	return (
		<section className="space-y-3">
			<button
				type="button"
				className="flex w-full items-start gap-2 text-left"
				aria-expanded={specs.sectionExpanded}
				onClick={specs.onToggleSection}
			>
				<ChevronDown
					className={cn(
						'mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform',
						specs.sectionExpanded
							? 'rotate-180'
							: 'rotate-0',
					)}
					aria-hidden={true}
				/>
				<span className="min-w-0 flex-1 space-y-1">
					<span className="text-sm font-medium text-muted-foreground block">
						{'Характеристики'}
					</span>
					<span className="text-muted-foreground block text-xs leading-snug">
						{'Материал, вес, габариты'}
					</span>
				</span>
			</button>
			<Collapse isCollapsed={!specs.sectionExpanded}>
				<div className="pt-1">
					<ProductSpecsFields
						idPrefix="create-product"
						disabled={specs.disabled}
						materialAndWeight={specs.materialAndWeight}
						dimensions={specs.dimensions}
					/>
				</div>
			</Collapse>
		</section>
	)
}

export {SpecsSection}
