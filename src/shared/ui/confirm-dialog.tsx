'use client'

import * as React from 'react'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from './alert-dialog'
import {Button} from './button'

function ConfirmDialog({
	open,
	onOpenChange,
	title,
	description,
	confirmLabel = 'Подтвердить',
	cancelLabel = 'Отмена',
	onConfirm,
	confirmVariant = 'destructive',
}: Readonly<{
	open: boolean,
	onOpenChange: (open: boolean) => void,
	title: string,
	description?: string,
	confirmLabel?: string,
	cancelLabel?: string,
	onConfirm: () => void,
	confirmVariant?: React.ComponentProps<typeof Button>['variant'],
}>) {
	return (
		<AlertDialog
			open={open}
			onOpenChange={onOpenChange}
		>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						{title}
					</AlertDialogTitle>
					{description
						? (
							<AlertDialogDescription>
								{description}
							</AlertDialogDescription>
						)
						: null}
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel asChild={true}>
						<Button
							variant="outline"
							type="button"
						>
							{cancelLabel}
						</Button>
					</AlertDialogCancel>
					<AlertDialogAction asChild={true}>
						<Button
							variant={confirmVariant}
							type="button"
							onClick={() => {
								onConfirm()
							}}
						>
							{confirmLabel}
						</Button>
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}

export {ConfirmDialog}
