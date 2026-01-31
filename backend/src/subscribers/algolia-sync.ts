import { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import algoliasearch from "algoliasearch"

const algoliaClient = algoliasearch(
  process.env.ALGOLIA_APP_ID || "",
  process.env.ALGOLIA_ADMIN_API_KEY || ""
)

const indexName = process.env.ALGOLIA_INDEX_NAME || "kong_products"
const index = algoliaClient.initIndex(indexName)

type ProductEvent = {
  id: string
  data: {
    id: string
  }
}

export default async function handleProductUpdate({ event }: SubscriberArgs<ProductEvent>) {
  const productId = event.data.id

  try {
    const response = await fetch(`http://localhost:9000/store/products/${productId}`)
    const { product } = await response.json()

    if (!product) {
      await index.deleteObject(productId)

      return
    }

    const algoliaObject = {
      objectID: product.id,
      title: product.title,
      description: product.description,
      handle: product.handle,
      thumbnail: product.thumbnail,
      variants: product.variants?.map((variant: any) => ({
        id: variant.id,
        title: variant.title,
        sku: variant.sku,
        prices: variant.prices,
      })),
      categories: product.categories?.map((cat: any) => cat.name) || [],
      collection: product.collection?.title || null,
      tags: product.tags?.map((tag: any) => tag.value) || [],
      created_at: product.created_at,
      updated_at: product.updated_at,
    }

    await index.saveObject(algoliaObject)
  } catch (error) {
    console.error("Error syncing product to Algolia:", error)
  }
}

export const config: SubscriberConfig = {
  event: [
    "product.created",
    "product.updated",
    "product.deleted",
  ],
}
