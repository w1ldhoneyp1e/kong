import {ProductDetailPageClient} from './ProductDetailPageClient'

type Props = Readonly<{
	params: Promise<{id: string}>,
}>

export default async function AdminProductDetailPage({params}: Props) {
	const {id} = await params

	return <ProductDetailPageClient id={id} />
}
