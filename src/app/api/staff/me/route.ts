import {proxyToBackend} from '../../_shared/proxyToBackend'

async function GET() {
	return proxyToBackend('/staff/me')
}

export {GET}

