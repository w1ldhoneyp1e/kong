import {NextResponse} from 'next/server'

const STAFF_TOKEN_COOKIE = 'kong_staff_token'

async function POST() {
	const response = NextResponse.json({ok: true})
	response.cookies.delete(STAFF_TOKEN_COOKIE)
	return response
}

export {POST}

