type StoreSettings = {
	id: string,
	name: string,
	supported_currency_codes: string[],
	default_currency_code: string,
	default_region_id: string | null,
	default_sales_channel_id: string | null,
}

export type {StoreSettings}
