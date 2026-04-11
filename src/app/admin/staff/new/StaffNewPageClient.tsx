'use client'

import {useRouter} from 'next/navigation'
import {useState} from 'react'
import {useCreateStaffUserMutation} from '../../../../entities/staff'
import {
	Button,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	EntityPageHeader,
	FormField,
	Input,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../../../../shared'
import {useStaffSession} from '../../StaffSessionContext'

function StaffNewPageClient() {
	const router = useRouter()
	const {permissions} = useStaffSession()
	const canAssignAdmin = permissions.includes('roles:manage')
	const createMutation = useCreateStaffUserMutation()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [roleCode, setRoleCode] = useState<'admin' | 'manager'>('manager')

	const error
		= createMutation.error instanceof Error
			? createMutation.error.message
			: createMutation.error
				? String(createMutation.error)
				: ''

	return (
		<div>
			<EntityPageHeader
				title="Новый пользователь"
				backHref="/admin/staff"
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
						/>
					</FormField>
					<FormField label="Пароль">
						<Input
							value={password}
							onChange={e => {
								setPassword(e.target.value)
							}}
							type="password"
							autoComplete="new-password"
						/>
					</FormField>
					<FormField label="Роль">
						<Select
							value={roleCode}
							onValueChange={v => {
								setRoleCode(v as 'admin' | 'manager')
							}}
						>
							<SelectTrigger>
								<SelectValue placeholder="Роль" />
							</SelectTrigger>
							<SelectContent>
								{canAssignAdmin
									? (
										<>
											<SelectItem value="admin">
												{'Админ'}
											</SelectItem>
											<SelectItem value="manager">
												{'Менеджер'}
											</SelectItem>
										</>
									)
									: (
										<SelectItem value="manager">
											{'Менеджер'}
										</SelectItem>
									)}
							</SelectContent>
						</Select>
					</FormField>
					<Button
						type="button"
						disabled={
							createMutation.isPending
							|| !email.trim()
							|| !password
						}
						onClick={() => {
							createMutation.mutate(
								{
									email: email.trim(),
									password,
									roleCode: canAssignAdmin
										? roleCode
										: 'manager',
								},
								{
									onSuccess: data => {
										router.push(
											`/admin/staff/${encodeURIComponent(data.id)}`,
										)
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

export {StaffNewPageClient}
