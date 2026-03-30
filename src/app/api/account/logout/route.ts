import {NextResponse} from 'next/server'

const STAFF_TOKEN_COOKIE = 'kong_staff_token'
const CUSTOMER_TOKEN_COOKIE = 'kong_customer_token'

async function POST() {
	const response = NextResponse.json({ok: true})
	response.cookies.delete(STAFF_TOKEN_COOKIE)
	response.cookies.delete(CUSTOMER_TOKEN_COOKIE)
	return response
}

export {POST}

