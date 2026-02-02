"use client"

import { useCallback, useState, type MouseEvent } from "react"
import { cn } from "../../lib/utils"
import { Link } from "../ui/link"
import { ProductImage } from "./ProductImage"
import { ProductTag, type ProductTagType } from "./ProductTag"
import { ProductLabel } from "./ProductLabel"
import { ProductTitle } from "./ProductTitle"
import { ProductDescription } from "./ProductDescription"
import { ProductColorVariationList } from "./ProductColorVariationList"
import { ProductPrice, type ProductPriceCurrency } from "./ProductPrice"
import { ProductRating } from "./ProductRating"
import { ProductFavorite } from "./ProductFavorite"

type ViewMode = "grid" | "list"

type ProductCardProps = {
  url?: string
  image?: string
  tags?: ProductTagType[]
  label?: string
  labelHighlighting?: React.ComponentType
  title?: string
  titleHighlighting?: React.ComponentType
  description?: string
  descriptionSnippeting?: React.ComponentType
  colors?: string[]
  price?: number
  originalPrice?: number
  currency?: ProductPriceCurrency
  rating?: number
  reviews?: number
  available?: boolean
  view?: ViewMode
  onLinkClick?: (e: MouseEvent<HTMLAnchorElement>) => void
}

function ProductCard({
  url = "",
  image,
  tags,
  label,
  labelHighlighting,
  title,
  titleHighlighting,
  description,
  descriptionSnippeting,
  colors,
  price,
  originalPrice,
  currency,
  rating,
  reviews,
  available = true,
  view = "grid",
  onLinkClick,
}: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const handleFavoriteClick = useCallback(
    () => setIsFavorite((favorite) => !favorite),
    []
  )

  const handleLinkClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      if (typeof onLinkClick === "function") onLinkClick(e)
    },
    [onLinkClick]
  )

  return (
    <article
      className={cn(
        "w-full h-full relative border border-transparent transition-all lg:p-3 group can-hover:lg:hover:shadow-sm",
        { "opacity-50": !available }
      )}
      style={{
        borderColor: "transparent",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--color-neutral-light)"
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "transparent"
      }}
    >
      <Link
        href={url}
        title="See product details"
        className={cn("flex gap-2", {
          "flex-col": view === "grid",
          "flex-row items-start": view === "list",
        })}
        onClick={handleLinkClick}
      >
        <div
          className={cn("relative", {
            "w-32 h-auto flex-shrink-0": view === "list",
          })}
        >
          {image ? (
            <ProductImage src={image} alt={title} />
          ) : (
            <div
              className="w-full aspect-[3/4] flex items-center justify-center text-sm"
              style={{
                backgroundColor: "var(--color-neutral-lightest)",
                color: "var(--color-neutral-dark)",
              }}
            >
              Нет изображения
            </div>
          )}

          {tags && tags.length > 0 && (
            <div className="absolute bottom-1 left-1 flex flex-col items-start gap-1">
              {tags.map((tag) => (
                <ProductTag
                  key={tag.label}
                  label={tag.label}
                  theme={tag.theme}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <header className="flex flex-col gap-1">
            {(label || labelHighlighting) && (
              <ProductLabel highlighting={labelHighlighting}>
                {label}
              </ProductLabel>
            )}
            {(title || titleHighlighting) && (
              <ProductTitle highlighting={titleHighlighting}>
                {title}
              </ProductTitle>
            )}
            {(description || descriptionSnippeting) && view === "list" && (
              <ProductDescription snippeting={descriptionSnippeting}>
                {description}
              </ProductDescription>
            )}
          </header>

          <footer className="flex flex-col gap-1">
            {colors && <ProductColorVariationList colors={colors} />}
            {price && (
              <ProductPrice
                price={price}
                originalPrice={originalPrice}
                currency={currency}
              />
            )}
            {typeof rating !== "undefined" && (
              <ProductRating rating={rating} reviews={reviews} />
            )}
          </footer>
        </div>
      </Link>

      <ProductFavorite
        className={cn(
          "hidden absolute top-1 lg:block lg:top-4",
          {
            "left-1 lg:left-4": view === "list",
            "right-1 lg:right-4": view === "grid",
          }
        )}
        isFavorite={isFavorite}
        onClick={handleFavoriteClick}
      />
    </article>
  )
}

export { ProductCard }
export type { ProductCardProps }
