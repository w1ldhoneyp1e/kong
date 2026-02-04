import {AdminNav} from './AdminNav'

export default function AdminLayout({
	children,
}: Readonly<{children: React.ReactNode}>) {
	return (
		<div className="flex min-h-[calc(100vh-0px)]">
			<aside className="hidden md:block">
				<AdminNav />
			</aside>
			<main className="flex-1 overflow-auto p-6">
				{children}
			</main>
		</div>
	)
}
