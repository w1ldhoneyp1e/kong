"use client"

import { m } from "framer-motion"

const variants = {
  hidden: {
    opacity: 0,
    y: 12,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

type ProductLayoutProps = {
  children: React.ReactNode
}

function ProductLayout({ children }: ProductLayoutProps) {
  return (
    <m.div
      initial="hidden"
      animate="visible"
      variants={variants}
      className="min-h-full"
    >
      {children}
    </m.div>
  )
}

export default ProductLayout
