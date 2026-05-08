import {
	IsArray,
	IsOptional,
	IsString,
} from 'class-validator'

export class UpdateStoreDto {
	@IsOptional()
	@IsString()
	name?: string

	@IsOptional()
	@IsArray()
	@IsString({each: true})
	supported_currency_codes?: string[]

	@IsOptional()
	@IsString()
	default_currency_code?: string

	@IsOptional()
	@IsString()
	default_region_id?: string | null

	@IsOptional()
	@IsString()
	default_sales_channel_id?: string | null
}
