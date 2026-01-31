"use client"

import { useHits } from "react-instantsearch"
import { ProductCard } from "../product/ProductCard"

function SearchHits() {
  const { hits } = useHits()

  if (hits.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Ничего не найдено. Попробуйте изменить запрос.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {hits.map((hit: any) => (
        <ProductCard
          key={hit.objectID}
          id={hit.objectID}
          title={hit.title}
          description={hit.description}
          image={hit.thumbnail}
          price={hit.variants?.[0]?.prices?.[0]?.amount}
          currency="RUB"
          tags={hit.tags}
          handle={hit.handle}
        />
      ))}
    </div>
  )
}

export { SearchHits }
