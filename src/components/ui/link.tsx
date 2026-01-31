import NextLink from "next/link"
import type { AnchorHTMLAttributes, MouseEventHandler, PropsWithChildren } from "react"
import { cn } from "../../lib/utils"

type LinkProps = PropsWithChildren<
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    href: string
    onClick?: MouseEventHandler<HTMLAnchorElement>
  }
>

function Link({ children, href, className, ...props }: LinkProps) {
  return (
    <NextLink href={href} className={cn(className)} {...props}>
      {children}
    </NextLink>
  )
}

export { Link }
export type { LinkProps }
