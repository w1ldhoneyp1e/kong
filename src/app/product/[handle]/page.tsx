import Image from "next/image"
import { Button } from "../../../components/ui/button"
import { Badge } from "../../../components/ui/badge"

type PageProps = {
  params: Promise<{
    handle: string
  }>
}

async function ProductPage({ params }: PageProps) {
  const { handle } = await params

  const mockProduct = {
    id: "1",
    title: "Классическая рубашка",
    description:
      "Стильная рубашка из 100% хлопка. Идеально подходит для повседневной носки и деловых встреч. Доступна в нескольких цветах.",
    image: null,
    price: 2990,
    originalPrice: 3990,
    currency: "RUB",
    tags: ["Новинка", "Хит продаж"],
    available: true,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Белый", "Голубой", "Черный"],
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
          {mockProduct.image ? (
            <Image
              src={mockProduct.image}
              alt={mockProduct.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              Нет изображения
            </div>
          )}

          {mockProduct.tags && mockProduct.tags.length > 0 && (
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {mockProduct.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{mockProduct.title}</h1>
            <p className="text-gray-600">{mockProduct.description}</p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold">
              {new Intl.NumberFormat("ru-RU", {
                style: "currency",
                currency: mockProduct.currency,
              }).format(mockProduct.price)}
            </span>
            {mockProduct.originalPrice && (
              <span className="text-xl text-gray-500 line-through">
                {new Intl.NumberFormat("ru-RU", {
                  style: "currency",
                  currency: mockProduct.currency,
                }).format(mockProduct.originalPrice)}
              </span>
            )}
          </div>

          <div>
            <h3 className="font-semibold mb-2">Размер</h3>
            <div className="flex gap-2">
              {mockProduct.sizes.map((size) => (
                <Button key={size} variant="outline" className="w-12">
                  {size}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Цвет</h3>
            <div className="flex gap-2">
              {mockProduct.colors.map((color) => (
                <Button key={color} variant="outline">
                  {color}
                </Button>
              ))}
            </div>
          </div>

          <Button size="lg" className="w-full">
            Добавить в корзину
          </Button>
        </div>
      </div>
    </div>
  )
}

export { ProductPage as default }
