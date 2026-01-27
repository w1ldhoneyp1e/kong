const API_URL = typeof window !== "undefined" ? "/api" : (process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000")

async function parseRes(res: Response): Promise<unknown> {
  const text = await res.text()

  if (!text) return {}

  try {
    return JSON.parse(text) as unknown
  } catch {
    throw new Error(res.ok ? "Ответ не JSON" : `HTTP ${res.status}: ${text.slice(0, 100)}`)
  }
}

export interface Category {
  id: string
  name: string
  slug: string
}

export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    const res = await fetch(`${API_URL}/categories`)
    const data = (await parseRes(res)) as { categories?: Category[]; message?: string; error?: string }

    if (!res.ok) {
      throw new Error(data?.message || data?.error || `HTTP ${res.status}`)
    }

    return data.categories ?? []
  },

  getById: async (id: string): Promise<Category> => {
    const res = await fetch(`${API_URL}/categories/${id}`)
    const data = (await parseRes(res)) as { category?: Category }

    if (!res.ok) throw new Error((data as { error?: string })?.error || `HTTP ${res.status}`)

    return data.category as Category
  },

  create: async (name: string, slug: string): Promise<Category> => {
    const res = await fetch(`${API_URL}/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, slug }),
    })
    const data = (await parseRes(res)) as { category?: Category; error?: string }

    if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`)

    return data.category as Category
  },

  update: async (id: string, name: string, slug: string): Promise<Category> => {
    const res = await fetch(`${API_URL}/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, slug }),
    })
    const data = (await parseRes(res)) as { category?: Category; error?: string }

    if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`)

    return data.category as Category
  },

  delete: async (id: string): Promise<void> => {
    const res = await fetch(`${API_URL}/categories/${id}`, { method: "DELETE" })

    if (!res.ok) {
      const data = (await parseRes(res)) as { error?: string }
      throw new Error(data?.error || `HTTP ${res.status}`)
    }
  },
}

export { categoriesApi as api }




