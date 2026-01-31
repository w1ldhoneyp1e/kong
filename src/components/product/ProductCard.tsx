import Image from "next/image"
import { Card, CardContent } from "../ui/card"
import { Link } from "../ui/link"
import { Badge } from "../ui/badge"

type ProductCardProps = {
  id: string
  title: string
  description?: string
  image?: string
  price?: number
  currency?: string
  tags?: string[]
  handle: string
}

function ProductCard({
  id,
  title,
  description,
  image,
  price,
  currency = "RUB",
  tags,
  handle,
}: ProductCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/product/${handle}`}>
        <div className="relative aspect-[3/4] bg-gray-100">
          {image ? (
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              Нет изображения
            </div>
          )}

          {tags && tags.length > 0 && (
            <div className="absolute bottom-2 left-2 flex flex-col gap-1">
              {tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <CardContent className="p-4">
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-sm line-clamp-2">{title}</h3>

            {description && (
              <p className="text-xs text-gray-600 line-clamp-2">{description}</p>
            )}

            {price && (
              <div className="font-bold text-lg">
                {new Intl.NumberFormat("ru-RU", {
                  style: "currency",
                  currency: currency,
                }).format(price)}
              </div>
            )}
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}

export { ProductCard }
export type { ProductCardProps }
