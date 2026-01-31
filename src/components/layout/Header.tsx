"use client"

import { ShoppingCart, User, Heart } from "lucide-react"
import { Logo } from "./Logo"
import { Link } from "../ui/link"
import { Button } from "../ui/button"
import { SearchBox } from "../search/SearchBox"

function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Logo />

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" title="Избранное">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" title="Аккаунт">
                <User className="h-5 w-5" />
              </Button>
              <Link href="/cart">
                <Button variant="ghost" size="icon" title="Корзина">
                  <ShoppingCart className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-6">
            <nav className="flex gap-6">
              <Link href="/catalog/women" className="text-sm font-medium uppercase hover:text-gray-600 transition-colors">
                Женщинам
              </Link>
              <Link href="/catalog/men" className="text-sm font-medium uppercase hover:text-gray-600 transition-colors">
                Мужчинам
              </Link>
              <Link href="/catalog/accessories" className="text-sm font-medium uppercase hover:text-gray-600 transition-colors">
                Аксессуары
              </Link>
            </nav>

            <div className="flex-1 max-w-md">
              <SearchBox />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export { Header }

