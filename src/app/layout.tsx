import {type Metadata} from 'next'
import localFont from 'next/font/local'
import {ServiceWorkerRegistration} from '../features/pwa'
import {SearchProvider} from '../features/search'
import {Footer} from '../widgets/footer'
import {AccountSessionProvider, ScrollOnNavigate} from '../widgets/header'
import './globals.css'
import {QueryProvider} from './QueryProvider'

const inter = localFont({
	src: [
		{
			path: '../../public/fonts/Inter-400.ttf',
			weight: '400',
			style: 'normal',
		},
		{
			path: '../../public/fonts/Inter-500.ttf',
			weight: '500',
			style: 'normal',
		},
		{
			path: '../../public/fonts/Inter-600.ttf',
			weight: '600',
			style: 'normal',
		},
		{
			path: '../../public/fonts/Inter-700.ttf',
			weight: '700',
			style: 'normal',
		},
	],
	variable: '--font-inter',
	display: 'swap',
})

export const metadata: Metadata = {
	title: 'Kong Store - Интернет-магазин',
	description: 'Современный интернет-магазин на Next.js и NestJS',
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
				<QueryProvider>
					<AccountSessionProvider>
						<ServiceWorkerRegistration />
						<SearchProvider>
							<ScrollOnNavigate />
							<div className="flex-1 min-h-0">
								{children}
							</div>
							<Footer />
						</SearchProvider>
					</AccountSessionProvider>
				</QueryProvider>
			</body>
		</html>
	)
}
