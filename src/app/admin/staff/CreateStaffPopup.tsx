'use client'

import {useEffect, useState} from 'react'
import {useCreateStaffUserMutation} from '../../../entities/staff'
import {
	Button,
	FormField,
	Input,
	Modal,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../../../shared'
import {useStaffSession} from '../StaffSessionContext'

function CreateStaffPopup({
	open,
	onOpenChange,
}: Readonly<{
	open: boolean,
	onOpenChange: (open: boolean) => void,
}>) {
	const {permissions} = useStaffSession()
	const canAssignAdmin = permissions.includes('roles:manage')
	const createMutation = useCreateStaffUserMutation()
	const [email, setEmail] = useState('')
	const [firstName, setFirstName] = useState('')
	const [lastName, setLastName] = useState('')
	const [password, setPassword] = useState('')
	const [roleCode, setRoleCode] = useState<'admin' | 'manager'>('manager')

	useEffect(() => {
		if (!open) {
			setEmail('')
			setFirstName('')
			setLastName('')
			setPassword('')
			setRoleCode('manager')
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
			ariaLabelledBy="create-staff-title"
		>
			<h2
				id="create-staff-title"
				className="mb-4 text-lg font-semibold"
			>
				{'Новый пользователь'}
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
									first_name: firstName.trim() || null,
									last_name: lastName.trim() || null,
									roleCode: canAssignAdmin
										? roleCode
										: 'manager',
								},
								{
									onSuccess: () => {
										onOpenChange(false)
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

export {CreateStaffPopup}
