import { cn } from "../../lib/utils"

type CountProps = {
  children: React.ReactNode
  className?: string
}

function Count({ children, className }: CountProps) {
  return (
    <div
      className={cn(
        "bg-neutral-200 text-black w-5 h-5 text-xs font-bold rounded-full flex items-center justify-center",
        className
      )}
    >
      {children}
    </div>
  )
}

export { Count }
export type { CountProps }
