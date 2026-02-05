import {HeaderTop} from '../../widgets/header'
import {AdminNav} from './AdminNav'

export default function AdminLayout({
	children,
}: Readonly<{children: React.ReactNode}>) {
	return (
		<>
			<header className="sticky top-0 z-50 bg-white shadow-md">
				<HeaderTop />
			</header>
			<div className="flex flex-1 min-h-0">
				<aside className="hidden md:block">
					<AdminNav />
				</aside>
				<main className="flex-1 overflow-auto p-6">
					{children}
				</main>
			</div>
		</>
	)
}
