import {type Metadata} from 'next'
import {Inter} from 'next/font/google'
import {ServiceWorkerRegistration} from '../features/pwa'
import {SearchProvider} from '../features/search'
import {Footer} from '../widgets/footer'
import {Header, ScrollOnNavigate} from '../widgets/header'
import './globals.css'

const inter = Inter({
	subsets: ['latin', 'cyrillic'],
	variable: '--font-inter',
})

export const metadata: Metadata = {
	title: 'Kong Store - Интернет-магазин',
	description: 'Современный интернет-магазин на Next.js и Medusa',
	viewport: {
		width: 'device-width',
		initialScale: 1,
		maximumScale: 1,
	},
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode,
}>) {
	return (
		<html lang="ru">
			<body className={`${inter.variable} font-sans antialiased flex flex-col min-h-screen`}>
				<ServiceWorkerRegistration />
				<SearchProvider>
					<Header />
					<ScrollOnNavigate />
					<main className="flex-1 min-h-0">{children}</main>
					<Footer />
				</SearchProvider>
			</body>
		</html>
	)
}
