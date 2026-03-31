import {ProductsListPageClient} from './ProductsListPageClient'
import {fetchAdminProductsServer} from './server'

export default async function AdminProductsPage() {
	const initialProducts = await fetchAdminProductsServer()

	return <ProductsListPageClient initialProducts={initialProducts} />
}
