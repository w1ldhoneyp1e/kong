import {HeaderNav, HeaderTop} from '../../widgets/header'

export default function StoreLayout({
	children,
}: Readonly<{children: React.ReactNode}>) {
	return (
		<>
			<header className="sticky top-0 z-50 bg-white shadow-md">
				<HeaderTop />
				<HeaderNav />
			</header>
			<main className="flex-1 min-h-0">
				{children}
			</main>
		</>
	)
}
