import {proxyToBackend} from '../../_shared/proxyToBackend'

export async function GET(
	_request: Request,
	{params}: {params: Promise<{id: string}>},
) {
	const {id} = await params
	return proxyToBackend(`/inventory-items/${id}`)
}
