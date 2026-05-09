import {type Metadata} from 'next'
import {getContentPageBySlug} from '../../../entities/content-page'

const metadata: Metadata = {
	title: 'Контакты',
	description: 'Контакты Kong Store: телефон, email и адрес.',
}

async function ContactsPage() {
	const page = await getContentPageBySlug('contacts')
	const lines = page?.body
		.split('\n')
		.map(item => item.trim())
		.filter(Boolean)
		?? []

	return (
		<div className="container mx-auto px-4 py-10 lg:py-14">
			<div className="max-w-3xl">
				<h1 className="text-3xl lg:text-4xl font-semibold">{page?.title ?? 'Контакты'}</h1>
				<div className="mt-6 space-y-3 text-muted-foreground">
					{lines.length > 0
						? lines.map((line, index) => (
							<p key={`${index.toString()}-${line.slice(0, 16)}`}>{line}</p>
						))
						: <p>{'Контакты появятся позже.'}</p>}
				</div>
			</div>
		</div>
	)
}

export {ContactsPage as default, metadata}
