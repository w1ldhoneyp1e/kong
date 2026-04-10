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

function formatMutationError(err: unknown): string {
	if (err instanceof Error) {
		return err.message
	}

	return String(err)
}

export {
	formatMutationError,
	parseNumberOrNull,
	productSpecsHaveAnyValue,
}
