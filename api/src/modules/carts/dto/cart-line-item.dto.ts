import {
	IsInt,
	IsOptional,
	IsString,
	Min,
} from 'class-validator'

export class CartLineItemDto {
	@IsOptional()
	@IsString()
	variant_id?: string

	@IsOptional()
	@IsString()
	line_id?: string

	@IsOptional()
	@IsInt()
	@Min(1)
	quantity?: number
}
