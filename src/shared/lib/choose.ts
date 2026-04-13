function choose<R>(
	cases: readonly (readonly [condition: boolean, getResult: () => R])[],
	fallback?: () => R,
): R {
	for (const [condition, getResult] of cases) {
		if (condition) {
			return getResult()
		}
	}
	if (fallback) {
		return fallback()
	}

	throw new Error('choose: no truthy condition found')
}

export {choose}
