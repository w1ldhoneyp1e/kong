import {type AdminOrder} from '../../../entities/order'

function formatOrderListTotal(order: AdminOrder): string {
	const cc = order.currency_code?.toUpperCase() ?? ''
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

		if (cur?.value) {
			return `${cur.value} ${cc}`.trim()
		}
	}

	return '—'
}

export {formatOrderListTotal}
