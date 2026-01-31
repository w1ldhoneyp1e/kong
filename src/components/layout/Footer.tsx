import { LogoSymbol } from "./Logo"
import { Link } from "../ui/link"

function Footer() {
  const footerSections = [
    {
      title: "Покупателям",
      links: [
        { label: "Доставка", href: "/delivery" },
        { label: "Оплата", href: "/payment" },
        { label: "Возврат", href: "/returns" },
      ],
    },
    {
      title: "Компания",
      links: [
        { label: "О нас", href: "/about" },
        { label: "Контакты", href: "/contact" },
        { label: "Вакансии", href: "/careers" },
      ],
    },
    {
      title: "Помощь",
      links: [
        { label: "FAQ", href: "/faq" },
        { label: "Поддержка", href: "/support" },
        { label: "Размеры", href: "/size-guide" },
      ],
    },
  ]

  return (
    <footer className="mt-auto">
      <div className="hidden lg:block bg-neutral-100 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-3 gap-8 max-w-4xl">
            {footerSections.map((section, i) => (
              <div key={i} className="flex flex-col gap-3">
                <div className="text-sm font-semibold uppercase">{section.title}</div>
                <ul className="text-sm flex flex-col gap-2">
                  {section.links.map((link, j) => (
                    <li key={j}>
                      <Link
                        href={link.href}
                        className="text-gray-700 hover:text-gray-900 transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-black flex flex-col items-center justify-center gap-4 py-8">
        <Link href="/" className="flex items-center gap-2">
          <LogoSymbol />
        </Link>

        <div className="text-white text-center text-sm">
          © 2026 Kong Store. Все права защищены.
        </div>
      </div>
    </footer>
  )
}

export { Footer }

