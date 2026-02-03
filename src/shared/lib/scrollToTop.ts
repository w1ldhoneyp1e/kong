function scrollToTop(
	behavior: 'auto' | 'smooth' = 'auto',
	root: HTMLElement | null = typeof document !== 'undefined'
		? document.documentElement
		: null,
) {
	if (root) {
		const defaultScrollBehavior = root.style.scrollBehavior
		root.style.scrollBehavior = behavior
		root.scrollTop = 0
		root.style.scrollBehavior = defaultScrollBehavior
	}
}

export {scrollToTop}
