import {type Metadata} from 'next'

const metadata: Metadata = {
	title: 'Контакты',
	description: 'Контакты Kong Store: телефон, email и адрес.',
}

function ContactsPage() {
	return (
		<div className="container mx-auto px-4 py-10 lg:py-14">
			<div className="max-w-3xl">
				<h1 className="text-3xl lg:text-4xl font-semibold">{'Контакты'}</h1>
				<div className="mt-6 space-y-3 text-muted-foreground">
					<p>{'Телефон: +7 (999) 000-00-00'}</p>
					<p>{'Email: support@kong.store'}</p>
					<p>{'Адрес: Москва, Примерная улица, 10'}</p>
				</div>
			</div>
		</div>
	)
}

export {ContactsPage as default, metadata}
