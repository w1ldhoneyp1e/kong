'use client'

import {Search} from 'lucide-react'
import {useRouter} from 'next/navigation'
import {
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react'
import {type SearchResponse, type SearchResultItem} from './searchTypes'

function SearchBox() {
	const router = useRouter()
	const [query, setQuery] = useState('')
	const [suggestions, setSuggestions] = useState<SearchResultItem[]>([])
	const [open, setOpen] = useState(false)
	const [loading, setLoading] = useState(false)
	const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
	const wrapperRef = useRef<HTMLDivElement>(null)

	const loadSuggestions = useCallback(async (q: string) => {
		if (!q.trim()) {
			setSuggestions([])
			return
		}
		setLoading(true)
		const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&limit=8`)
		const data = await res.json().catch(() => ({results: []})) as SearchResponse
		setSuggestions(data.results ?? [])
		setLoading(false)
		setOpen(true)
	}, [])

	useEffect(() => {
		if (debounceRef.current) {
			clearTimeout(debounceRef.current)
		}
		if (!query.trim()) {
			setSuggestions([])
			setOpen(false)
			return
		}
		debounceRef.current = setTimeout(() => {
			loadSuggestions(query)
		}, 200)
		return () => {
			if (debounceRef.current) {
				clearTimeout(debounceRef.current)
			}
		}
	}, [query, loadSuggestions])

	useEffect(() => {
		function handleClickOutside(e: MouseEvent) {
			if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
				setOpen(false)
			}
		}
		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [])

	const submit = useCallback(
		(q: string) => {
			const trimmed = q.trim()
			setOpen(false)
			setSuggestions([])
			if (trimmed) {
				router.push(`/search?q=${encodeURIComponent(trimmed)}`)
			}
		},
		[router],
	)

	const typeLabel = (type: SearchResultItem['type']): string => {
		if (type === 'category') {
			return 'Категория'
		}

		if (type === 'page') {
			return 'Страница'
		}

		return 'Товар'
	}

	return (
		<div
			className="relative w-full"
			ref={wrapperRef}
		>
			<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
			<input
				type="search"
				value={query}
				onChange={e => setQuery(e.target.value)}
				onKeyDown={e => {
					if (e.key === 'Enter') {
						e.preventDefault()
						submit(query)
					}
				}}
				onFocus={() => query.trim() && setOpen(true)}
				placeholder="Поиск товаров..."
				className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
			/>
			{open && (suggestions.length > 0 || loading) && (
				<ul
					className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-md shadow-lg z-50 max-h-60 overflow-auto"
					role="listbox"
				>
					{loading && suggestions.length === 0
						? (
							<li className="px-4 py-2 text-gray-500 text-sm">{'Загрузка...'}</li>
						)
						: (
							suggestions.map(s => (
								<li
									key={`${s.type}-${s.id}`}
									role="option"
									className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 first:rounded-t-md last:rounded-b-md"
									onMouseDown={e => {
										e.preventDefault()
										setQuery(s.title)
										setOpen(false)
										setSuggestions([])
										router.push(s.href)
									}}
								>
									<div className="flex items-center justify-between gap-3">
										<span className="font-medium">{s.title}</span>
										<span className="text-xs text-gray-500">{typeLabel(s.type)}</span>
									</div>
									{s.description
										? <div className="mt-0.5 line-clamp-1 text-xs text-gray-500">{s.description}</div>
										: null}
								</li>
							))
						)}
				</ul>
			)}
		</div>
	)
}

export {SearchBox}
