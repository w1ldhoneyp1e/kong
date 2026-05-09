import {Link} from '../../../../shared'

type CheckoutSuccessPageProps = {
	searchParams?: Promise<{
		order?: string,
	}>,
}

export default async function CheckoutSuccessPage({
	searchParams,
}: CheckoutSuccessPageProps) {
	const params = searchParams
		? await searchParams
		: {}
	const orderId = params.order?.trim() || null

	return (
		<div className="container mx-auto px-4 py-12 lg:py-16">
			<div className="mx-auto max-w-2xl rounded-lg border bg-card p-8 shadow-sm">
				<h1 className="text-3xl font-semibold">{'Спасибо, заказ оформлен'}</h1>
				<p className="mt-3 text-muted-foreground">
					{'Мы получили заказ и скоро возьмем его в работу. Если понадобится уточнение, свяжемся по указанным контактам.'}
				</p>
				{orderId && (
					<div className="mt-6 rounded-md border bg-muted/30 px-4 py-3">
						<p className="text-sm font-medium">{'Номер заказа'}</p>
						<p className="mt-1 text-sm text-muted-foreground">{orderId}</p>
					</div>
				)}
				<div className="mt-8 flex flex-col gap-3 sm:flex-row">
					<Link
						href="/"
						className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
					>
						{'На главную'}
					</Link>
					<Link
						href="/catalog/karabiny"
						className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium"
					>
						{'Продолжить выбор товаров'}
					</Link>
				</div>
			</div>
		</div>
	)
}
