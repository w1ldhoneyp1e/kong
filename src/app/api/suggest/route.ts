import {type NextRequest, NextResponse} from 'next/server'

const YANDEX_SUGGEST_URL = 'https://suggest.yandex.ru/suggest-ya'

function parseSuggestions(text: string): string[] {
	const lines = text.split('\n').filter(Boolean)
	const line = lines[1]
	if (lines.length < 2 || line === undefined) {
		return []
	}
	try {
		const second = JSON.parse(line) as unknown
		if (!Array.isArray(second) || second.length === 0) {
			return []
		}
		if (typeof second[0] === 'string') {
			return (second as string[]).slice(0, 10)
		}
		return second
			.filter((item): item is string[] => Array.isArray(item) && typeof item[0] === 'string')
			.map(item => item[0])
			.filter((s): s is string => typeof s === 'string')
			.slice(0, 10)
	}
	catch {
		return []
	}
}

export async function GET(request: NextRequest) {
	const q = request.nextUrl.searchParams.get('q')?.trim()
	if (!q) {
		return NextResponse.json({suggestions: []})
	}
	try {
		const url = `${YANDEX_SUGGEST_URL}?part=${encodeURIComponent(q)}&uil=ru&v=4&sn=5&lr=84`
		const res = await fetch(url, {
			headers: {'Accept': 'application/json, text/plain, */*'},
			next: {revalidate: 0},
		})
		const text = await res.text()
		const suggestions = parseSuggestions(text)
		return NextResponse.json({suggestions})
	}
	catch {
		return NextResponse.json({suggestions: []})
	}
}
