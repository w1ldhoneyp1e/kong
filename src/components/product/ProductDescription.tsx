import { cn } from "../../lib/utils"

type ProductDescriptionProps = {
  children: React.ReactNode
  snippeting?: React.ComponentType
  className?: string
}

function ProductDescription({
  children,
  snippeting: Snippeting,
  className = "small-regular",
}: ProductDescriptionProps) {
  return <p className={cn(className)}>{Snippeting ? <Snippeting /> : children}</p>
}

export { ProductDescription }
export type { ProductDescriptionProps }
