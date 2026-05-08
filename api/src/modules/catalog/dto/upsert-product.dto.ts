import {
	IsArray,
	IsBoolean,
	IsInt,
	IsOptional,
	IsString,
	Min,
	ValidateNested,
} from 'class-validator'
import {Type} from 'class-transformer'

export class UpsertProductVariantPriceDto {
	@IsInt()
	@Min(0)
	amount!: number

	@IsString()
	currency_code!: string
}

export class UpsertProductVariantDto {
	@IsOptional()
	@IsString()
	id?: string

	@IsString()
	title!: string

	@IsOptional()
	@IsString()
	sku?: string

	@IsBoolean()
	available!: boolean

	@IsArray()
	@ValidateNested({each: true})
	@Type(() => UpsertProductVariantPriceDto)
	prices!: UpsertProductVariantPriceDto[]
}

export class UpsertProductDto {
	@IsString()
	title!: string

	@IsOptional()
	@IsString()
	subtitle?: string

	@IsOptional()
	@IsString()
	handle?: string

	@IsOptional()
	@IsString()
	description?: string

	@IsOptional()
	@IsString()
	status?: string

	@IsOptional()
	@IsString()
	thumbnail?: string

	@IsOptional()
	@IsArray()
	@IsString({each: true})
	tag_ids?: string[]

	@IsOptional()
	@IsArray()
	@IsString({each: true})
	category_ids?: string[]

	@IsArray()
	@ValidateNested({each: true})
	@Type(() => UpsertProductVariantDto)
	variants!: UpsertProductVariantDto[]
}
