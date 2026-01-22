"use client"

import { useState, useEffect } from "react"
import { categoriesApi, Category } from "../../../lib/api/categories"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"

export default function CategoriesAdminPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [newName, setNewName] = useState("")
  const [newSlug, setNewSlug] = useState("")

  const [editId, setEditId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")
  const [editSlug, setEditSlug] = useState("")

  const loadCategories = async () => {
    try {
      setLoading(true)
      const data = await categoriesApi.getAll()
      setCategories(data)
      setError("")
    } catch (err) {
      setError("Ошибка загрузки категорий. Проверь, что backend запущен.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newName || !newSlug) {
      setError("Заполни все поля")

      return
    }

    try {
      await categoriesApi.create(newName, newSlug)
      setNewName("")
      setNewSlug("")
      await loadCategories()
      setError("")
    } catch (err) {
      setError("Ошибка создания категории")
    }
  }

  const handleEdit = (category: Category) => {
    setEditId(category.id)
    setEditName(category.name)
    setEditSlug(category.slug)
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!editId) return

    try {
      await categoriesApi.update(editId, editName, editSlug)
      setEditId(null)
      setEditName("")
      setEditSlug("")
      await loadCategories()
      setError("")
    } catch (err) {
      setError("Ошибка обновления категории")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Точно удалить категорию?")) return

    try {
      await categoriesApi.delete(id)
      await loadCategories()
      setError("")
    } catch (err) {
      setError("Ошибка удаления категории")
    }
  }

  const handleCancelEdit = () => {
    setEditId(null)
    setEditName("")
    setEditSlug("")
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Управление категориями</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Создать категорию</CardTitle>
              <CardDescription>Добавь новую категорию товаров</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Название
                  </label>
                  <Input
                    type="text"
                    placeholder="Электроника"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Slug (URL)
                  </label>
                  <Input
                    type="text"
                    placeholder="electronics"
                    value={newSlug}
                    onChange={(e) => setNewSlug(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full">
                  Создать
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Список категорий</CardTitle>
              <CardDescription>
                {loading ? "Загрузка..." : `Найдено: ${categories.length}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-center py-8 text-muted-foreground">
                  Загрузка...
                </p>
              ) : categories.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">
                  Категорий пока нет. Создай первую!
                </p>
              ) : (
                <div className="space-y-4">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="border rounded-lg p-4"
                    >
                      {editId === category.id ? (
                        <form onSubmit={handleUpdate} className="space-y-3">
                          <div>
                            <label className="text-sm font-medium mb-1 block">
                              Название
                            </label>
                            <Input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-1 block">
                              Slug
                            </label>
                            <Input
                              type="text"
                              value={editSlug}
                              onChange={(e) => setEditSlug(e.target.value)}
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button type="submit" size="sm">
                              Сохранить
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={handleCancelEdit}
                            >
                              Отмена
                            </Button>
                          </div>
                        </form>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">
                              {category.name}
                            </h3>
                            <Badge variant="secondary" className="mt-1">
                              {category.slug}
                            </Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(category)}
                            >
                              Изменить
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(category.id)}
                            >
                              Удалить
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

