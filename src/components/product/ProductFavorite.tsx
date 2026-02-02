import { Heart } from "lucide-react"
import { cn } from "../../lib/utils"
import { Button } from "../ui/button"

type ProductFavoriteProps = {
  isFavorite?: boolean
  onClick?: () => void
  className?: string
}

function ProductFavorite({
  isFavorite = false,
  onClick,
  className,
}: ProductFavoriteProps) {
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      className={cn(
        "opacity-0 group-hover:opacity-100 transition-opacity bg-white hover:bg-white",
        className
      )}
      onClick={onClick}
      title={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart
        className={cn("w-5 h-5", {
          "fill-current": isFavorite,
        })}
        style={{
          color: isFavorite ? "var(--color-venus-base)" : "var(--color-brand-black)",
        }}
      />
    </Button>
  )
}

export { ProductFavorite }
export type { ProductFavoriteProps }
