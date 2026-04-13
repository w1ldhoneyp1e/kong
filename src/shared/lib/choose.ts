type ChooseCase<R> = readonly [condition: boolean, getResult: () => R]

function choose<R>(...args: readonly (ChooseCase<R> | (() => R))[]): R {
	const lastArg = args.at(-1)
	let fallback: (() => R) | undefined
	if (typeof lastArg === 'function' && !Array.isArray(lastArg)) {
		fallback = lastArg
	}
	const cases = fallback
		? args.slice(0, -1)
		: args
	for (const item of cases) {
		if (!Array.isArray(item)) {
			continue
		}
		const [condition, getResult] = item
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
