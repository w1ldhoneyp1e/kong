'use client'

import {
	type RefObject,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react'
import {create} from 'zustand'
import {useShallow} from 'zustand/react/shallow'

type HeaderAccountPopoverStoreState = {
	isOpen: boolean,
	top: number,
	left: number,
	setOpen: (isOpen: boolean) => void,
	setPosition: (next: {
		top: number,
		left: number,
	}) => void,
}

const useHeaderAccountPopoverStore = create<HeaderAccountPopoverStoreState>(set => ({
	isOpen: false,
	top: 0,
	left: 0,
	setOpen: isOpen => set({isOpen}),
	setPosition: ({top, left}) => set({
		top,
		left,
	}),
}))

type HeaderAccountPopoverVm = {
	isMounted: boolean,
	isOpen: boolean,
	top: number,
	left: number,
	triggerRef: RefObject<HTMLDivElement | null>,
	open: () => void,
	closeNow: () => void,
	closeDelayed: () => void,
	toggle: () => void,
	portalProps: {
		top: number,
		left: number,
		onMouseEnter: () => void,
		onMouseLeave: () => void,
	},
	triggerProps: {
		onMouseEnter: () => void,
		onMouseLeave: () => void,
		onToggle: () => void,
	},
}

function useHeaderAccountPopoverVm(): HeaderAccountPopoverVm {
	const {
		isOpen, top, left, setOpen, setPosition,
	} = useHeaderAccountPopoverStore(useShallow(state => ({
		isOpen: state.isOpen,
		top: state.top,
		left: state.left,
		setOpen: state.setOpen,
		setPosition: state.setPosition,
	})))

	const triggerRef = useRef<HTMLDivElement | null>(null)
	const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
	const [isMounted, setIsMounted] = useState(false)

	const open = useCallback(() => {
		if (closeTimerRef.current) {
			clearTimeout(closeTimerRef.current)
		}

		closeTimerRef.current = null
		setOpen(true)
	}, [setOpen])

	const closeNow = useCallback(() => {
		if (closeTimerRef.current) {
			clearTimeout(closeTimerRef.current)
		}

		closeTimerRef.current = null
		setOpen(false)
	}, [setOpen])

	const closeDelayed = useCallback(() => {
		if (closeTimerRef.current) {
			clearTimeout(closeTimerRef.current)
		}

		closeTimerRef.current = setTimeout(() => {
			setOpen(false)
			closeTimerRef.current = null
		}, 120)
	}, [setOpen])

	const toggle = useCallback(() => {
		if (isOpen) {
			closeNow()

			return
		}

		open()
	}, [closeNow, isOpen, open])

	useEffect(() => {
		if (!isOpen) {
			return
		}

		const updatePosition = () => {
			const el = triggerRef.current
			if (!el) {
				return
			}

			const rect = el.getBoundingClientRect()
			setPosition({
				top: rect.bottom + 8,
				left: rect.right - 224,
			})
		}

		updatePosition()
		window.addEventListener('scroll', updatePosition, true)
		window.addEventListener('resize', updatePosition)

		return () => {
			window.removeEventListener('scroll', updatePosition, true)
			window.removeEventListener('resize', updatePosition)
		}
	}, [isOpen, setPosition])

	useEffect(() => {
		setIsMounted(true)

		return () => {
			setIsMounted(false)
		}
	}, [])

	useEffect(() => () => {
		if (closeTimerRef.current) {
			clearTimeout(closeTimerRef.current)
		}
	}, [])

	const portalProps = useMemo(() => ({
		top,
		left,
		onMouseEnter: open,
		onMouseLeave: closeDelayed,
	}), [closeDelayed, left, open, top])

	const triggerProps = useMemo(() => ({
		onMouseEnter: open,
		onMouseLeave: closeDelayed,
		onToggle: toggle,
	}), [closeDelayed, open, toggle])

	return {
		isMounted,
		isOpen,
		top,
		left,
		triggerRef,
		open,
		closeNow,
		closeDelayed,
		toggle,
		portalProps,
		triggerProps,
	}
}

export {
	useHeaderAccountPopoverVm,
	type HeaderAccountPopoverVm,
}

