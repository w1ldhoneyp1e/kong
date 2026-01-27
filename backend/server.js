const express = require("express")
const cors = require("cors")

const app = express()
const PORT = process.env.PORT || 9000

const allowedOrigins = (process.env.STORE_CORS || "http://localhost:3000,http://127.0.0.1:3000").split(",").map((s) => s.trim())
app.use(cors({ origin: allowedOrigins, credentials: true }))
app.use(express.json())

const categories = [
  { id: "1", name: "Электроника", slug: "electronics" },
  { id: "2", name: "Одежда", slug: "clothing" },
  { id: "3", name: "Книги", slug: "books" },
]

app.get("/", (req, res) => {
  res.json({ message: "Kong Store API", version: "1.0.0", status: "ok" })
})

app.get("/store/categories", (req, res) => {
  res.json({ categories })
})

app.get("/store/categories/:id", (req, res) => {
  const category = categories.find((c) => c.id === req.params.id)
  if (!category) return res.status(404).json({ error: "Категория не найдена" })
  res.json({ category })
})

app.post("/store/categories", (req, res) => {
  const { name, slug } = req.body || {}
  if (!name || !slug) return res.status(400).json({ error: "name и slug обязательны" })
  const newCategory = { id: String(categories.length + 1), name, slug }
  categories.push(newCategory)
  res.status(201).json({ category: newCategory })
})

app.put("/store/categories/:id", (req, res) => {
  const idx = categories.findIndex((c) => c.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: "Категория не найдена" })
  const { name, slug } = req.body || {}
  if (name) categories[idx].name = name
  if (slug) categories[idx].slug = slug
  res.json({ category: categories[idx] })
})

app.delete("/store/categories/:id", (req, res) => {
  const idx = categories.findIndex((c) => c.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: "Категория не найдена" })
  categories.splice(idx, 1)
  res.status(204).send()
})

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Kong Store API: http://0.0.0.0:${PORT}`)
  console.log(`Categories:    http://0.0.0.0:${PORT}/store/categories`)
})
