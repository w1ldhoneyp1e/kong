import {proxyToBackend} from '../_shared/proxyToBackend'

async function GET() {
	return proxyToBackend('/product-tags')
}

export {GET}
