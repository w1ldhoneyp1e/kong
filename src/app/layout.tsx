import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Header } from "../components/layout/Header"
import { Footer } from "../components/layout/Footer"
import { PageTransition } from "../components/layout/PageTransition"
import { SearchProvider } from "../components/search/SearchProvider"
import { ServiceWorkerRegistration } from "../components/pwa/ServiceWorkerRegistration"
import "./globals.css"

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Kong Store - Интернет-магазин",
  description: "Современный интернет-магазин на Next.js и Medusa",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru">
      <body className={`${inter.variable} font-sans antialiased flex flex-col min-h-screen`}>
        <ServiceWorkerRegistration />
        <SearchProvider>
          <Header />
          <PageTransition>{children}</PageTransition>
          <Footer />
        </SearchProvider>
      </body>
    </html>
  )
}
