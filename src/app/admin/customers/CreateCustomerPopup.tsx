'use client'

import {useRouter} from 'next/navigation'
import {useEffect, useState} from 'react'
import {useCreateCustomerMutation} from '../../../entities/customer'
import {
	Button,
	FormField,
	Input,
	Modal,
} from '../../../shared'

function CreateCustomerPopup({
	open,
	onOpenChange,
}: Readonly<{
	open: boolean,
	onOpenChange: (open: boolean) => void,
}>) {
	const router = useRouter()
	const createMutation = useCreateCustomerMutation()
	const [email, setEmail] = useState('')
	const [firstName, setFirstName] = useState('')
	const [lastName, setLastName] = useState('')

	useEffect(() => {
		if (!open) {
			setEmail('')
			setFirstName('')
			setLastName('')
		}
	}, [open])

	const error
		= createMutation.error instanceof Error
			? createMutation.error.message
			: createMutation.error
				? String(createMutation.error)
				: ''

	if (!open) {
		return null
	}

	return (
		<Modal
			onClose={() => {
				onOpenChange(false)
			}}
			disabled={createMutation.isPending}
			className="max-w-md"
			ariaLabelledBy="create-customer-title"
		>
			<h2
				id="create-customer-title"
				className="mb-4 text-lg font-semibold"
			>
				{'Новый покупатель'}
			</h2>
			{error
				? (
					<p
						className="mb-4 text-sm text-destructive"
						role="alert"
					>
						{error}
					</p>
				)
				: null}
			<div className="space-y-4">
				<FormField label="Email">
					<Input
						value={email}
						onChange={e => {
							setEmail(e.target.value)
						}}
						type="email"
						autoComplete="off"
					/>
				</FormField>
				<FormField label="Имя">
					<Input
						value={firstName}
						onChange={e => {
							setFirstName(e.target.value)
						}}
						autoComplete="off"
					/>
				</FormField>
				<FormField label="Фамилия">
					<Input
						value={lastName}
						onChange={e => {
							setLastName(e.target.value)
						}}
						autoComplete="off"
					/>
				</FormField>
				<div className="flex flex-wrap justify-end gap-2 pt-2">
					<Button
						type="button"
						variant="outline"
						onClick={() => {
							onOpenChange(false)
						}}
					>
						{'Отмена'}
					</Button>
					<Button
						type="button"
						disabled={createMutation.isPending || !email.trim()}
						onClick={() => {
							createMutation.mutate(
								{
									email: email.trim(),
									first_name: firstName.trim() || null,
									last_name: lastName.trim() || null,
								},
								{
									onSuccess: data => {
										onOpenChange(false)
										router.push(`/admin/customers/${data.id}`)
									},
								},
							)
						}}
					>
						{'Создать'}
					</Button>
				</div>
			</div>
		</Modal>
	)
}

export {CreateCustomerPopup}
