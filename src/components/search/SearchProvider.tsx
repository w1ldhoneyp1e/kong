"use client"

import { InstantSearch } from "react-instantsearch"
import { searchClient, indexName } from "../../lib/algolia/client"

type SearchProviderProps = {
  children: React.ReactNode
}

function SearchProvider({ children }: SearchProviderProps) {
  return (
    <InstantSearch searchClient={searchClient} indexName={indexName}>
      {children}
    </InstantSearch>
  )
}

export { SearchProvider }
