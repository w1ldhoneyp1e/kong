function match<K extends string | number, R>(
	value: K,
	cases: Partial<Record<K, () => R>>,
	fallback?: () => R,
): R {
	const fn = cases[value]
	if (typeof fn === 'function') {
		return fn()
	}
	if (fallback) {
		return fallback()
	}
	throw new Error(`match: no case for value "${String(value)}"`)
}

export {match}
