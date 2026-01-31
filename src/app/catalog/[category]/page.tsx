import { ProductCard } from "../../../components/product/ProductCard"

type PageProps = {
  params: Promise<{
    category: string
  }>
}

async function CatalogPage({ params }: PageProps) {
  const { category } = await params

  const mockProducts = [
    {
      id: "1",
      title: "Классическая рубашка",
      description: "Стильная рубашка из хлопка",
      image: null,
      price: 2990,
      currency: "RUB",
      tags: ["Новинка"],
      handle: "classic-shirt",
    },
    {
      id: "2",
      title: "Джинсы slim fit",
      description: "Удобные джинсы для повседневной носки",
      image: null,
      price: 3990,
      currency: "RUB",
      tags: ["Хит"],
      handle: "slim-jeans",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold capitalize">
          {category === "women" ? "Женщинам" : category === "men" ? "Мужчинам" : "Аксессуары"}
        </h1>
        <p className="text-gray-600 mt-2">Найдено товаров: {mockProducts.length}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {mockProducts.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  )
}

export { CatalogPage as default }
