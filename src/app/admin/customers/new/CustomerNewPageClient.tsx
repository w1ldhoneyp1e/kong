'use client'

import {useRouter} from 'next/navigation'
import {useState} from 'react'
import {useCreateCustomerMutation} from '../../../../entities/customer'
import {
	Button,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	EntityPageHeader,
	FormField,
	Input,
} from '../../../../shared'

function CustomerNewPageClient() {
	const router = useRouter()
	const createMutation = useCreateCustomerMutation()
	const [email, setEmail] = useState('')
	const [firstName, setFirstName] = useState('')
	const [lastName, setLastName] = useState('')

	const error
		= createMutation.error instanceof Error
			? createMutation.error.message
			: createMutation.error
				? String(createMutation.error)
				: ''

	return (
		<div>
			<EntityPageHeader
				title="Новый покупатель"
				backHref="/admin/customers"
			/>
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
			<Card className="max-w-lg">
				<CardHeader>
					<CardTitle>
						{'Данные'}
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<FormField label="Email">
						<Input
							value={email}
							onChange={e => {
								setEmail(e.target.value)
							}}
							type="email"
							autoComplete="off"
							required={true}
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
										router.push(`/admin/customers/${data.id}`)
									},
								},
							)
						}}
					>
						{'Создать'}
					</Button>
				</CardContent>
			</Card>
		</div>
	)
}

export {CustomerNewPageClient}
