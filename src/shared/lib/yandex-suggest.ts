async function fetchSuggestions(query: string): Promise<string[]> {
	if (!query.trim()) {
		return []
	}

	const params = new URLSearchParams({q: query.trim()})
	const res = await fetch(`/api/suggest?${params}`)
	if (!res.ok) {
		return []
	}

	const data = (await res.json()) as {suggestions?: string[]}
	return Array.isArray(data.suggestions)
		? data.suggestions
		: []
}

export {fetchSuggestions}
