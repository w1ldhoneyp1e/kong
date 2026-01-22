const API_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

export interface Category {
  id: string
  name: string
  slug: string
}

export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    const res = await fetch(`${API_URL}/store/categories`)
    const data = await res.json()

    return data.categories
  },

  getById: async (id: string): Promise<Category> => {
    const res = await fetch(`${API_URL}/store/categories/${id}`)
    const data = await res.json()

    return data.category
  },

  create: async (name: string, slug: string): Promise<Category> => {
    const res = await fetch(`${API_URL}/store/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, slug }),
    })
    const data = await res.json()

    return data.category
  },

  update: async (id: string, name: string, slug: string): Promise<Category> => {
    const res = await fetch(`${API_URL}/store/categories/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, slug }),
    })
    const data = await res.json()

    return data.category
  },

  delete: async (id: string): Promise<void> => {
    await fetch(`${API_URL}/store/categories/${id}`, {
      method: "DELETE",
    })
  },
}

export { categoriesApi as api }

