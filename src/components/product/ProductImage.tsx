"use client"

import { cn } from "../../lib/utils"
import Image from "next/image"
import { useCallback, useState } from "react"

type ProductImageProps = {
  src: string
  alt?: string
  className?: string
}

function ProductImage({ src, alt = "", className }: ProductImageProps) {
  const [loaded, setLoaded] = useState(false)

  const handleLoadingComplete = useCallback(() => {
    setLoaded(true)
  }, [])

  return (
    <div
      className={cn("bg-neutral-100", className)}
      style={{ backgroundColor: "var(--color-neutral-lightest)" }}
    >
      <Image
        src={src}
        alt={alt}
        width={400}
        height={540}
        className={cn(
          "transition-all duration-[2000ms] ease-out can-hover:group-hover:scale-110",
          {
            "!opacity-0": !loaded,
          }
        )}
        onLoadingComplete={handleLoadingComplete}
      />
    </div>
  )
}

export { ProductImage }
export type { ProductImageProps }
