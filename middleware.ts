import {type NextRequest, NextResponse} from 'next/server'

const STAFF_TOKEN_COOKIE = 'kong_staff_token'

function middleware(req: NextRequest) {
	const {pathname} = req.nextUrl

	if (pathname.startsWith('/admin')) {
		const staffToken = req.cookies.get(STAFF_TOKEN_COOKIE)?.value
		if (!staffToken) {
			const url = new URL('/account/login', req.url)

			return NextResponse.redirect(url)
		}
	}

	return NextResponse.next()
}

const config = {
	matcher: ['/admin/:path*'],
}

export {
	middleware,
	config,
}
