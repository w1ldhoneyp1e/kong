"use client"

import { Search } from "lucide-react"
import { useSearchBox } from "react-instantsearch"

function SearchBox() {
  const { query, refine } = useSearchBox()

  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      <input
        type="search"
        value={query}
        onChange={(e) => refine(e.target.value)}
        placeholder="Поиск товаров..."
        className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
    </div>
  )
}

export { SearchBox }
