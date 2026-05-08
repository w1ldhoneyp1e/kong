import {
	IsInt,
	IsOptional,
	IsString,
	Min,
} from 'class-validator'
import {Type} from 'class-transformer'

export class ListOrdersQueryDto {
	@IsOptional()
	@IsString()
	status?: string

	@IsOptional()
	@IsString()
	customer_id?: string

	@IsOptional()
	@IsString()
	q?: string

	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(0)
	limit?: number

	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(0)
	offset?: number
}
