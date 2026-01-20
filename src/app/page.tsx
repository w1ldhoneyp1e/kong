import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import Link from "next/link"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <section className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4">
          Добро пожаловать в Kong Store
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Современный интернет-магазин на Next.js и Medusa
        </p>
        <Link href="/products">
          <Button size="lg">
            Смотреть товары
          </Button>
        </Link>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Быстрая доставка</CardTitle>
            <CardDescription>
              Доставим ваш заказ в кратчайшие сроки
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Бесплатная доставка при заказе от 3000 ₽
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Гарантия качества</CardTitle>
            <CardDescription>
              Все товары сертифицированы
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              30 дней на возврат без объяснения причин
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Поддержка 24/7</CardTitle>
            <CardDescription>
              Мы всегда на связи
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Ответим на любые вопросы в течение часа
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
