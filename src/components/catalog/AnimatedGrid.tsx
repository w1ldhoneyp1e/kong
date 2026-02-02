"use client"

import { m } from "framer-motion"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

type AnimatedGridProps = {
  children: React.ReactNode
  className?: string
}

function AnimatedGrid({ children, className }: AnimatedGridProps) {
  return (
    <m.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {children}
    </m.div>
  )
}

type AnimatedGridItemProps = {
  children: React.ReactNode
}

function AnimatedGridItem({ children }: AnimatedGridItemProps) {
  return <m.div variants={itemVariants}>{children}</m.div>
}

export { AnimatedGrid, AnimatedGridItem }
