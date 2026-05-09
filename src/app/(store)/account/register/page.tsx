'use client'

import {useRouter} from 'next/navigation'
import {useState} from 'react'
import {
	Button,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	Input,
	Label,
} from '../../../../shared'
import {type AccountMe, useAccountSession} from '../../../../widgets/header'

export default function AccountRegisterPage() {
	const router = useRouter()
	const {hydrateAccount} = useAccountSession()
	const [firstName, setFirstName] = useState('')
	const [lastName, setLastName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')

	const handleSubmit = async (ev: React.FormEvent) => {
		ev.preventDefault()
		setLoading(true)
		setError('')

		try {
			const res = await fetch('/api/account/register', {
				method: 'POST',
				credentials: 'same-origin',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					email,
					password,
					firstName,
					lastName,
				}),
			})

			const data = await res.json().catch(() => ({}))
			if (!res.ok) {
				throw new Error((data as any)?.error ?? `HTTP ${res.status}`)
			}

			const account = (data as {account?: AccountMe})?.account
			if (account) {
				hydrateAccount(account)
			}

			router.push('/')
		}
		catch (e) {
			setError(e instanceof Error
				? e.message
				: 'Ошибка регистрации')
		}
		finally {
			setLoading(false)
		}
	}

	return (
		<div className="container mx-auto px-4 py-12 max-w-md">
			<Card>
				<CardHeader>
					<CardTitle>{'Регистрация'}</CardTitle>
					<CardDescription>{'Создайте аккаунт клиента'}</CardDescription>
				</CardHeader>
				<CardContent>
					<form
						onSubmit={handleSubmit}
						className="space-y-4"
					>
						<div>
							<Label htmlFor="reg-firstName">{'Имя'}</Label>
							<Input
								id="reg-firstName"
								value={firstName}
								onChange={e => setFirstName(e.target.value)}
								className="mt-1"
							/>
						</div>
						<div>
							<Label htmlFor="reg-lastName">{'Фамилия'}</Label>
							<Input
								id="reg-lastName"
								value={lastName}
								onChange={e => setLastName(e.target.value)}
								className="mt-1"
							/>
						</div>
						<div>
							<Label htmlFor="reg-email">{'Email'}</Label>
							<Input
								id="reg-email"
								value={email}
								onChange={e => setEmail(e.target.value)}
								className="mt-1"
							/>
						</div>
						<div>
							<Label htmlFor="reg-password">{'Пароль'}</Label>
							<Input
								id="reg-password"
								type="password"
								value={password}
								onChange={e => setPassword(e.target.value)}
								className="mt-1"
							/>
							<p className="mt-1 text-xs text-muted-foreground">
								{'Подойдет любой непустой пароль.'}
							</p>
						</div>
						{error && <p className="text-destructive text-sm">{error}</p>}
						<Button
							type="submit"
							state={loading
								? 'loading'
								: 'default'}
							className="w-full"
						>
							{loading
								? 'Регистрация...'
								: 'Зарегистрироваться'}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	)
}
