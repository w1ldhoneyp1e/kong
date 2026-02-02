import { cn } from "../../lib/utils"

type ProductTitleProps = {
  children: React.ReactNode
  highlighting?: React.ComponentType
  className?: string
}

function ProductTitle({
  children,
  highlighting: Highlighting,
  className = "small-bold tracking-normal",
}: ProductTitleProps) {
  return (
    <h1 className={cn(className)} style={{ color: "var(--color-brand-black)" }}>
      {Highlighting ? <Highlighting /> : children}
    </h1>
  )
}

export { ProductTitle }
export type { ProductTitleProps }
