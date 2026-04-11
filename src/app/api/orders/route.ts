import {type NextRequest} from 'next/server'
import {proxyToBackend} from '../_shared/proxyToBackend'

export async function GET(req: NextRequest) {
	const search = req.nextUrl.search
	const path = search
		? `/orders${search}`
		: '/orders'

	return proxyToBackend(path)
}
