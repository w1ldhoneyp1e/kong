import {type AdminOrder} from '../../../entities/order'

function formatMinorUnits(amount: number, currencyCode: string): string {
	return new Intl.NumberFormat('ru-RU', {
		style: 'currency',
		currency: currencyCode || 'RUB',
	}).format(amount / 100)
}

function parseMinorUnits(value: unknown): number | null {
	if (typeof value === 'number' && Number.isFinite(value)) {
		return value
	}

	if (typeof value === 'string' && value.trim()) {
		const parsed = Number(value)
		return Number.isFinite(parsed)
			? parsed
			: null
	}

	return null
}

function formatOrderListTotal(order: AdminOrder): string {
	const currencyCode = order.currency_code?.toUpperCase() ?? 'RUB'
	const rows = order.summary ?? []

	for (const row of rows) {
		if (!row || typeof row !== 'object') {
			continue
		}

		const totals = row.totals as Record<string, {value?: string} | undefined> | undefined

		if (!totals || typeof totals !== 'object') {
			continue
		}

		const cur = totals.current_order_total ?? totals.order_total

		const amount = parseMinorUnits(cur?.value)
		if (amount !== null) {
			return formatMinorUnits(amount, currencyCode)
		}
	}

	const fallbackAmount = parseMinorUnits((order as AdminOrder & {total?: unknown}).total)
	if (fallbackAmount !== null) {
		return formatMinorUnits(fallbackAmount, currencyCode)
	}

	return '—'
}

export {formatOrderListTotal}
