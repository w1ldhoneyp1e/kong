type SearchResultItem = {
	type: 'product' | 'category' | 'page',
	id: string,
	title: string,
	description: string | null,
	href: string,
	score: number,
}

type SearchResponse = {
	query: string,
	results: SearchResultItem[],
}

export type {
	SearchResponse,
	SearchResultItem,
}
