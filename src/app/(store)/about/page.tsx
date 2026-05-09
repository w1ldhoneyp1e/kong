import {type Metadata} from 'next'
import {getContentPageBySlug} from '../../../entities/content-page'

const metadata: Metadata = {
	title: 'О нас',
	description: 'О компании Kong Store и нашем подходе к покупательскому опыту.',
}

async function AboutPage() {
	const page = await getContentPageBySlug('about')
	const bodyParagraphs = page?.body
		.split(/\n{2,}|\n/)
		.map(item => item.trim())
		.filter(Boolean)
		?? []

	return (
		<div className="container mx-auto px-4 py-10 lg:py-14">
			<div className="max-w-3xl">
				<h1 className="text-3xl lg:text-4xl font-semibold">{page?.title ?? 'О нас'}</h1>
				{bodyParagraphs.length > 0
					? bodyParagraphs.map((paragraph, index) => (
						<p
							key={`${index.toString()}-${paragraph.slice(0, 16)}`}
							className={index === 0
								? 'mt-4 text-base text-muted-foreground'
								: 'mt-3 text-base text-muted-foreground'}
						>
							{paragraph}
						</p>
					))
					: (
						<p className="mt-4 text-base text-muted-foreground">
							{'Информация о компании появится позже.'}
						</p>
					)}
			</div>
		</div>
	)
}

export {AboutPage as default, metadata}
