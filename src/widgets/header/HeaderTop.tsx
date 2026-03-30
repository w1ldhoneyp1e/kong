'use client'

import {
	Heart,
	LogIn,
	ShoppingCart,
	User,
} from 'lucide-react'
import {usePathname, useRouter} from 'next/navigation'
import {
	useEffect,
	useRef,
	useState,
} from 'react'
import {createPortal} from 'react-dom'
import {Button, Link} from '../../shared'
import {useAccountSession} from './AccountSessionContext'
import {Logo} from './Logo'

function HeaderTop() {
	const router = useRouter()
	const pathname = usePathname()
	const {
		account, isReady, clearSession,
	} = useAccountSession()

	const [isPopoverOpen, setIsPopoverOpen] = useState(false)
	const [isMounted, setIsMounted] = useState(false)
	const [popoverTop, setPopoverTop] = useState(0)
	const [popoverLeft, setPopoverLeft] = useState(0)
	const accountTriggerRef = useRef<HTMLDivElement | null>(null)
	const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

	useEffect(() => {
		setIsMounted(true)

		return () => {
			setIsMounted(false)
		}
	}, [])

	useEffect(() => {
		if (!isPopoverOpen) {
			return
		}

		const updatePosition = () => {
			const el = accountTriggerRef.current
			if (!el) {
				return
			}

			const rect = el.getBoundingClientRect()
			setPopoverTop(rect.bottom + 8)
			setPopoverLeft(rect.right - 224)
		}

		updatePosition()
		window.addEventListener('scroll', updatePosition, true)
		window.addEventListener('resize', updatePosition)

		return () => {
			window.removeEventListener('scroll', updatePosition, true)
			window.removeEventListener('resize', updatePosition)
		}
	}, [isPopoverOpen])

	useEffect(() => () => {
		if (closeTimerRef.current) {
			clearTimeout(closeTimerRef.current)
		}
	}, [])

	const openPopover = () => {
		if (closeTimerRef.current) {
			clearTimeout(closeTimerRef.current)
			closeTimerRef.current = null
		}

		setIsPopoverOpen(true)
	}

	const closePopoverWithDelay = () => {
		if (closeTimerRef.current) {
			clearTimeout(closeTimerRef.current)
		}

		closeTimerRef.current = setTimeout(() => {
			setIsPopoverOpen(false)
			closeTimerRef.current = null
		}, 120)
	}

	const isAuthenticated = account.authenticated === true
	const roleCode = account.roleCode ?? null
	const isAdminPortal = roleCode === 'admin' || roleCode === 'owner'
	const isManagerPortal = roleCode === 'manager'
	const isStaff = isAdminPortal || isManagerPortal
	const isInAdmin = pathname.startsWith('/admin')
	const accountLabel = account.email ?? 'Пользователь'
	const portalHref = isInAdmin
		? '/'
		: '/admin'
	const portalLabel = isInAdmin
		? 'В магазин'
		: (isAdminPortal
			? 'В портал администратора'
			: 'В портал менеджера')

	const handleLogout = async () => {
		await fetch('/api/account/logout', {method: 'POST'}).catch(() => {})
		setIsPopoverOpen(false)
		clearSession()
		router.push('/')
		router.refresh()
	}

	const loadingSlot = (
		<div
			className="h-9 w-9 shrink-0 animate-pulse rounded-md bg-muted"
			aria-hidden={true}
		/>
	)

	const accountIconSlot = isAuthenticated
		? (
			<div
				className="relative shrink-0"
				ref={accountTriggerRef}
				onMouseEnter={openPopover}
				onMouseLeave={closePopoverWithDelay}
			>
				<Button
					variant="ghost"
					size="icon"
					title="Аккаунт"
					type="button"
					onClick={() => setIsPopoverOpen(v => !v)}
				>
					<User className="h-5 w-5" />
				</Button>
			</div>
		)
		: (
			<div
				className="relative shrink-0"
				ref={accountTriggerRef}
				onMouseEnter={openPopover}
				onMouseLeave={closePopoverWithDelay}
			>
				<Button
					variant="ghost"
					size="icon"
					title="Вход"
					type="button"
					onClick={() => setIsPopoverOpen(v => !v)}
				>
					<LogIn className="h-5 w-5" />
				</Button>
			</div>
		)

	const authSlot = !isReady
		? loadingSlot
		: accountIconSlot

	const showAccountPortal = isMounted && isPopoverOpen && isReady && isAuthenticated
	const showGuestPortal = isMounted && isPopoverOpen && isReady && !isAuthenticated

	return (
		<div className="border-b">
			<div className="container mx-auto px-4 py-4">
				<div className="flex items-center justify-between">
					<Logo />
					<div className="flex items-center gap-4">
						<Button
							variant="ghost"
							size="icon"
							title="Избранное"
						>
							<Heart className="h-5 w-5" />
						</Button>
						<Link href="/cart">
							<Button
								variant="ghost"
								size="icon"
								title="Корзина"
							>
								<ShoppingCart className="h-5 w-5" />
							</Button>
						</Link>
						{authSlot}
					</div>
				</div>
			</div>
			{showAccountPortal && createPortal(
				<div
					className="fixed z-[120] w-56"
					style={{
						top: popoverTop,
						left: popoverLeft,
					}}
					onMouseEnter={openPopover}
					onMouseLeave={closePopoverWithDelay}
				>
					<div className="rounded-md border bg-white shadow-lg p-2 space-y-1">
						<div className="px-3 py-2">
							<p className="text-xs text-muted-foreground">
								{'Вы вошли как'}
							</p>
							<p className="text-sm font-medium break-all">
								{accountLabel}
							</p>
							<p className="text-xs text-muted-foreground mt-1">
								{roleCode ?? 'user'}
							</p>
						</div>
						{isStaff && (
							<div className="pt-2 border-t mt-2">
								<Link
									href={portalHref}
									className="block px-3 py-2 rounded-md text-sm hover:bg-muted"
									onClick={() => setIsPopoverOpen(false)}
								>
									{portalLabel}
								</Link>
							</div>
						)}
						<div className="pt-2 border-t mt-2">
							<Button
								type="button"
								variant="ghost"
								className="w-full justify-start"
								onClick={handleLogout}
							>
								{'Выйти'}
							</Button>
						</div>
					</div>
				</div>,
				document.body,
			)}
			{showGuestPortal && createPortal(
				<div
					className="fixed z-[120] w-56"
					style={{
						top: popoverTop,
						left: popoverLeft,
					}}
					onMouseEnter={openPopover}
					onMouseLeave={closePopoverWithDelay}
				>
					<div className="rounded-md border bg-white shadow-lg p-1">
						<Link
							href="/account/login"
							className="block px-3 py-2 rounded-md text-sm hover:bg-muted"
							onClick={() => setIsPopoverOpen(false)}
						>
							{'Войти'}
						</Link>
						<Link
							href="/account/register"
							className="block px-3 py-2 rounded-md text-sm hover:bg-muted"
							onClick={() => setIsPopoverOpen(false)}
						>
							{'Зарегистрироваться'}
						</Link>
					</div>
				</div>,
				document.body,
			)}
		</div>
	)
}

export {HeaderTop}
