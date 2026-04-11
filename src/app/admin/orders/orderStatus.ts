const ORDER_STATUS_OPTIONS = [
	{
		value: 'all',
		label: 'Все статусы',
	},
	{
		value: 'pending',
		label: 'Ожидает',
	},
	{
		value: 'completed',
		label: 'Завершён',
	},
	{
		value: 'canceled',
		label: 'Отменён',
	},
	{
		value: 'archived',
		label: 'Архив',
	},
	{
		value: 'requires_action',
		label: 'Нужны действия',
	},
	{
		value: 'draft',
		label: 'Черновик',
	},
] as const

function getOrderStatusLabel(status: string | null | undefined): string {
	if (!status) {
		return '—'
	}

	const found = ORDER_STATUS_OPTIONS.find(o => o.value === status)

	return found?.label ?? status
}

const ORDER_STATUS_EDIT_OPTIONS = ORDER_STATUS_OPTIONS.filter(
	o => o.value !== 'all',
)

export {
	getOrderStatusLabel,
	ORDER_STATUS_EDIT_OPTIONS,
	ORDER_STATUS_OPTIONS,
}
