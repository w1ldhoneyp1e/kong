import * as React from 'react'
import {cn} from '../lib/utils'
import {Button} from './button'
import {Link} from './link'

function EntityPageHeader({
	title,
	backHref,
	backLabel = 'Назад',
	breadcrumbs,
	actions,
	className,
}: Readonly<{
	title: React.ReactNode,
	backHref?: string,
	backLabel?: string,
	breadcrumbs?: React.ReactNode,
	actions?: React.ReactNode,
	className?: string,
}>) {
	return (
		<div className={cn('mb-8 flex flex-col gap-4', className)}>
			{breadcrumbs
				? (
					<div className="text-sm text-muted-foreground">
						{breadcrumbs}
					</div>
				)
				: null}
			<div className="flex flex-wrap items-center justify-between gap-4">
				<div className="flex min-w-0 items-center gap-3">
					{backHref
						? (
							<Button
								variant="outline"
								size="sm"
								asChild={true}
							>
								<Link href={backHref}>
									{backLabel}
								</Link>
							</Button>
						)
						: null}
					<h1 className="truncate text-2xl font-semibold tracking-tight">
						{title}
					</h1>
				</div>
				{actions
					? (
						<div className="flex shrink-0 flex-wrap items-center gap-2">
							{actions}
						</div>
					)
					: null}
			</div>
		</div>
	)
}

export {EntityPageHeader}
