import {type VariantProps} from 'class-variance-authority'
import {type badgeVariants, Badge} from './badge'

type BadgeVariant = VariantProps<typeof badgeVariants>['variant']

const STATUS_VARIANT: Record<string, BadgeVariant> = {
	active: 'default',
	published: 'default',
	proposed: 'secondary',
	rejected: 'destructive',
	completed: 'secondary',
	draft: 'outline',
	pending: 'outline',
	archived: 'secondary',
	cancelled: 'destructive',
	canceled: 'destructive',
	failed: 'destructive',
	requires_action: 'outline',
}

function normalizeStatusKey(raw: string): string {
	return raw.trim().toLowerCase()
		.replace(/\s+/g, '_')
}

function StatusBadge({
	status,
	label,
	className,
}: {
	status: string,
	label?: string,
	className?: string,
}) {
	const key = normalizeStatusKey(status)
	const variant = STATUS_VARIANT[key] ?? 'secondary'
	const text = label ?? status

	return (
		<Badge
			variant={variant}
			className={className}
		>
			{text}
		</Badge>
	)
}

export {StatusBadge}
