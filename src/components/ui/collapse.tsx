"use client"

import { motion, useReducedMotion, type Variants } from "framer-motion"
import { cn } from "../../lib/utils"

type CollapseProps = {
  isCollapsed: boolean
  className?: string
  children: React.ReactNode
}

const variants: Variants = {
  collapsed: (shouldReduceMotion: boolean) => {
    return {
      height: shouldReduceMotion ? "auto" : 0,
      opacity: 0,
      pointerEvents: "none" as const,
      transitionEnd: { display: "none" },
    }
  },
  expanded: (shouldReduceMotion: boolean) => {
    return {
      height: shouldReduceMotion ? "auto" : "auto",
      opacity: 1,
      pointerEvents: "auto" as const,
      display: "block",
    }
  },
}

const transition = {
  ease: [0.16, 1, 0.3, 1],
  duration: 0.6,
}

function Collapse({ isCollapsed, className, children }: CollapseProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      key="collapse"
      initial="collapsed"
      animate={isCollapsed ? "collapsed" : "expanded"}
      variants={variants}
      className={cn("overflow-hidden", className)}
      transition={transition}
      custom={shouldReduceMotion}
    >
      {children}
    </motion.div>
  )
}

export { Collapse }
export type { CollapseProps }
