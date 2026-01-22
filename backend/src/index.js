const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")

const app = express()
const PORT = process.env.PORT || 9000

app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:8000"],
  credentials: true,
}))
app.use(bodyParser.json())

const categories = [
  { id: "1", name: "Электроника", slug: "electronics" },
  { id: "2", name: "Одежда", slug: "clothing" },
  { id: "3", name: "Книги", slug: "books" },
]

app.get("/", (req, res) => {
  res.json({
    message: "Kong Store API (Medusa compatible)",
    version: "1.0.0",
    status: "ok",
  })
})

const categoriesRouter = require("./api/store/categories/route")
const categoryRouter = require("./api/store/categories/[id]/route")

app.get("/store/categories", categoriesRouter.GET)
app.post("/store/categories", categoriesRouter.POST)
app.get("/store/categories/:id", categoryRouter.GET)
app.put("/store/categories/:id", categoryRouter.PUT)
app.delete("/store/categories/:id", categoryRouter.DELETE)

app.listen(PORT, "0.0.0.0", () => {
  console.log("")
  console.log("╔════════════════════════════════════════╗")
  console.log("║  🚀 Kong Store Backend Started        ║")
  console.log("╚════════════════════════════════════════╝")
  console.log("")
  console.log(`🌍 API:        http://localhost:${PORT}`)
  console.log(`📦 Categories: http://localhost:${PORT}/store/categories`)
  console.log("")
  console.log("💡 Это упрощенная версия, совместимая с Medusa API")
  console.log("   Полная установка Medusa будет позже")
  console.log("")
})

module.exports = app

