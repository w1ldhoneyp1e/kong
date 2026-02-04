import {proxyToBackend} from '../_shared/proxyToBackend'

export async function GET() {
	return proxyToBackend('/customers')
}
