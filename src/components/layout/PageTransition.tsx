"use client"

import { AnimatePresence, m } from "framer-motion"
import { usePathname } from "next/navigation"
import { useCallback } from "react"
import { scrollToTop } from "../../lib/scrollToTop"

const variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.25,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: "easeIn",
    },
  },
}

type PageTransitionProps = {
  children: React.ReactNode
}

function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()

  const handleExitComplete = useCallback(() => {
    scrollToTop("auto")
  }, [])

  return (
    <AnimatePresence mode="wait" onExitComplete={handleExitComplete}>
      <m.main
        key={pathname}
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={variants}
        className="flex-1"
      >
        {children}
      </m.main>
    </AnimatePresence>
  )
}

export { PageTransition }
