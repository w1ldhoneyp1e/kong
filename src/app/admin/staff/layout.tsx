import {StaffSectionLayout} from './StaffSectionLayout'

export default function StaffLayout({
	children,
}: Readonly<{children: React.ReactNode}>) {
	return <StaffSectionLayout>{children}</StaffSectionLayout>
}
