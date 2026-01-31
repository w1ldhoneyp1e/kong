import algoliasearch from "algoliasearch/lite"

const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || ""
const searchApiKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY || ""

const searchClient = algoliasearch(appId, searchApiKey)

const indexName = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME || "kong_products"

export { searchClient, indexName }
