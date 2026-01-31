import * as React from "react"
import { cn } from "../../lib/utils"
import { Button } from "./button"

type ChipProps = React.ComponentProps<typeof Button> & {
  selected?: boolean
  closeIcon?: boolean
}

function Chip({
  children,
  className,
  selected = false,
  closeIcon = false,
  variant = "outline",
  size = "sm",
  ...props
}: ChipProps) {
  return (
    <Button
      variant={selected ? "default" : variant}
      size={size}
      className={cn(
        "rounded-sm transition-colors",
        selected && "bg-black text-white hover:bg-black/90",
        className
      )}
      {...props}
    >
      {children}
      {closeIcon && (
        <svg
          className="w-4 h-4 ml-1"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      )}
    </Button>
  )
}

export { Chip }
export type { ChipProps }
