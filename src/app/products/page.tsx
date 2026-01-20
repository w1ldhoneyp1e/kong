import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"

export default function ProductsPage() {
  const products = [
    {
      id: 1,
      name: "Товар 1",
      price: "1 990 ₽",
      description: "Описание товара 1",
      inStock: true,
    },
    {
      id: 2,
      name: "Товар 2",
      price: "2 990 ₽",
      description: "Описание товара 2",
      inStock: true,
    },
    {
      id: 3,
      name: "Товар 3",
      price: "3 990 ₽",
      description: "Описание товара 3",
      inStock: false,
    },
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Каталог товаров</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle>{product.name}</CardTitle>
                {product.inStock ? (
                  <Badge>В наличии</Badge>
                ) : (
                  <Badge variant="secondary">Нет в наличии</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {product.description}
              </p>
              <p className="text-2xl font-bold">{product.price}</p>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                disabled={!product.inStock}
              >
                {product.inStock ? "В корзину" : "Недоступно"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

