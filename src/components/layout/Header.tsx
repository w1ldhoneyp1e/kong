import Link from 'next/link'

const Header = () => {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold">
          Kong Store
        </Link>
        
        <nav className="flex gap-6">
          <Link href="/products" className="hover:underline">
            Товары
          </Link>
          <Link href="/cart" className="hover:underline">
            Корзина
          </Link>
          <Link href="/admin/categories" className="hover:underline text-blue-600">
            Админ
          </Link>
        </nav>
      </div>
    </header>
  )
}

export { Header }

