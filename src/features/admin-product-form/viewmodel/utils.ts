function productSpecsHaveAnyValue(values: Record<string, string>): boolean {
	return Object.values(values).some(value => value.trim().length > 0)
}

function parseNumberOrNull(value: string): number | null | undefined {
	const trimmed = value.trim()
	if (!trimmed) {
		return null
	}

	const n = Number(trimmed)
	if (Number.isNaN(n)) {
		return undefined
	}

	return n
}

function parseMoneyToMinorUnits(value: string): number | null | undefined {
	const parsed = parseNumberOrNull(value)
	if (parsed === null || parsed === undefined) {
		return parsed
	}

	return Math.round(parsed * 100)
}

function formatMutationError(err: unknown): string {
	if (err instanceof Error) {
		return err.message
	}

	return String(err)
}

export {
	formatMutationError,
	parseMoneyToMinorUnits,
	parseNumberOrNull,
	productSpecsHaveAnyValue,
}
