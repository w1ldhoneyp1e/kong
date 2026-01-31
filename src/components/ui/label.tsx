import { cn } from "../../lib/utils"

type LabelProps = {
  label: string
  className?: string
}

function Label({ label = "", className }: LabelProps) {
  return <div className={cn("text-sm font-semibold uppercase", className)}>{label}</div>
}

export { Label }
export type { LabelProps }
