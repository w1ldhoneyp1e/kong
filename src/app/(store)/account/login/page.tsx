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

export default function AccountLoginPage() {
	const router = useRouter()
	const {hydrateAccount} = useAccountSession()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')

	const handleSubmit = async (ev: React.FormEvent) => {
		ev.preventDefault()
		setLoading(true)
		setError('')

		try {
			const res = await fetch('/api/account/login', {
				method: 'POST',
				credentials: 'same-origin',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					email,
					password,
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

			if ((data as {actorType?: string})?.actorType === 'staff') {
				router.push('/admin')
			}
			else {
				router.push('/')
			}
		}
		catch (e) {
			setError(e instanceof Error
				? e.message
				: 'Ошибка входа')
		}
		finally {
			setLoading(false)
		}
	}

	return (
		<div className="container mx-auto px-4 py-12 max-w-md">
			<Card>
				<CardHeader>
					<CardTitle>{'Вход'}</CardTitle>
					<CardDescription>{'Единый вход для клиента и staff'}</CardDescription>
				</CardHeader>
				<CardContent>
					<form
						onSubmit={handleSubmit}
						className="space-y-4"
					>
						<div>
							<Label htmlFor="login-email">{'Email'}</Label>
							<Input
								id="login-email"
								value={email}
								onChange={e => setEmail(e.target.value)}
								className="mt-1"
							/>
						</div>
						<div>
							<Label htmlFor="login-password">{'Пароль'}</Label>
							<Input
								id="login-password"
								type="password"
								value={password}
								onChange={e => setPassword(e.target.value)}
								className="mt-1"
							/>
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
								? 'Вход...'
								: 'Войти'}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	)
}

