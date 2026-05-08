import {
	IsInt,
	IsOptional,
	IsString,
	Min,
} from 'class-validator'
import {Type} from 'class-transformer'

export class ListCustomersQueryDto {
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
