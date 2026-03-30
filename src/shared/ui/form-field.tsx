import * as React from 'react'
import {cn} from '../lib/utils'
import {Label} from './label'

function FormField({
	label,
	htmlFor,
	error,
	className,
	children,
}: Readonly<{
	label: React.ReactNode,
	htmlFor?: string,
	error?: string | null,
	className?: string,
	children: React.ReactNode,
}>) {
	return (
		<div className={cn('space-y-2', className)}>
			<Label htmlFor={htmlFor}>
				{label}
			</Label>
			{children}
			{error
				? (
					<p
						className="text-sm text-destructive"
						role="alert"
					>
						{error}
					</p>
				)
				: null}
		</div>
	)
}

export {FormField}
