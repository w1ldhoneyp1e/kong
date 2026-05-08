import {type Metadata} from 'next'
import Image from 'next/image'
import {notFound} from 'next/navigation'
import {getProductByHandle} from '../../../../entities/product'
import {Badge} from '../../../../shared'
import {ProductPurchasePanel} from './ProductPurchasePanel'

type PageProps = {
	params: Promise<{
		handle: string,
	}>,
}

async function generateMetadata({params}: PageProps): Promise<Metadata> {
	const {handle} = await params
	const product = await getProductByHandle(handle)

	return {
		title: product?.title ?? 'Товар',
		description: product?.description ?? 'Карточка товара',
	}
}

async function ProductPage({params}: PageProps) {
	const {handle} = await params
	const product = await getProductByHandle(handle)
	if (!product) {
		notFound()
	}
	return (
		<div className="container mx-auto px-4 py-8">
			<div className="grid md:grid-cols-2 gap-8">
				<div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
					{product.thumbnail
						? (
							<Image
								src={product.thumbnail}
								alt={product.title ?? 'Товар'}
								fill={true}
								className="object-cover"
							/>
						)
						: (
							<div className="w-full h-full flex items-center justify-center text-gray-400">
								{'Нет изображения'}
							</div>
						)}
					{product.tags && product.tags.length > 0 && (
						<div className="absolute top-4 left-4 flex flex-col gap-2">
							{product.tags.map(tag => (
								<Badge
									key={tag.value}
									variant="secondary"
								>
									{tag.value}
								</Badge>
							))}
						</div>
					)}
				</div>
				<div className="flex flex-col gap-6">
					<div>
						<h1 className="text-3xl font-bold mb-2">{product.title ?? 'Без названия'}</h1>
						<p className="text-gray-600">{product.description ?? 'Описание появится позже.'}</p>
					</div>
					<ProductPurchasePanel variants={product.variants} />
				</div>
			</div>
		</div>
	)
}

export {generateMetadata, ProductPage as default}
