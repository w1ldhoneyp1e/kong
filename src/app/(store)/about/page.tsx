import {type Metadata} from 'next'

const metadata: Metadata = {
	title: 'О нас',
	description: 'О компании Kong Store и нашем подходе к покупательскому опыту.',
}

function AboutPage() {
	return (
		<div className="container mx-auto px-4 py-10 lg:py-14">
			<div className="max-w-3xl">
				<h1 className="text-3xl lg:text-4xl font-semibold">{'О нас'}</h1>
				<p className="mt-4 text-base text-muted-foreground">
					{'Kong Store делает удобный и понятный онлайн-шопинг: от быстрого выбора товара до прозрачного оформления заказа.'}
				</p>
				<p className="mt-3 text-base text-muted-foreground">
					{'Мы развиваем витрину, чтобы покупатель мог легко находить товары, сравнивать варианты и получать актуальную информацию о заказе.'}
				</p>
			</div>
		</div>
	)
}

export {AboutPage as default, metadata}
