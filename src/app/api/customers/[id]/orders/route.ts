import {type NextRequest} from 'next/server'
import {proxyToBackend} from '../../../_shared/proxyToBackend'

async function GET(
	req: NextRequest,
	{params}: {params: Promise<{id: string}>},
) {
	const {id} = await params
	const search = req.nextUrl.search
	const path = search
		? `/customers/${id}/orders${search}`
		: `/customers/${id}/orders`

	return proxyToBackend(path)
}

export {GET}
