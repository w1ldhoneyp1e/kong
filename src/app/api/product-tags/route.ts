import {proxyToCatalogBackend} from '../_shared/proxyToBackend'

async function GET() {
	return proxyToCatalogBackend('/product-tags')
}

export {GET}
