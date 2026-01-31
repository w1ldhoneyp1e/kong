import { cn } from "../../lib/utils"

type IconProps = {
  icon: any
  className?: string
}

function Icon({ icon: IconCmp = null, className = "w-6 h-6" }: IconProps) {
  if (!IconCmp) return null

  return <IconCmp className={cn(className)} />
}

export { Icon }
