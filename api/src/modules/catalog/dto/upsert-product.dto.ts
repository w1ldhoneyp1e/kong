import {
	IsArray,
	IsBoolean,
	IsInt,
	IsNumber,
	IsObject,
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

	@IsArray()
	@ValidateNested({each: true})
	@Type(() => UpsertProductVariantPriceDto)
	prices!: UpsertProductVariantPriceDto[]

	@IsOptional()
	@IsObject()
	metadata?: {
		available?: boolean,
	} & Record<string, unknown>
}

export class UpsertProductImageDto {
	@IsOptional()
	@IsString()
	id?: string

	@IsString()
	url!: string
}

export class UpsertProductDocumentDto {
	@IsString()
	id!: string

	@IsString()
	title!: string

	@IsString()
	kind!: string

	@IsString()
	sourceType!: string

	@IsString()
	url!: string
}

export class UpsertProductMetadataDto {
	@IsOptional()
	@IsArray()
	@ValidateNested({each: true})
	@Type(() => UpsertProductDocumentDto)
	documents?: UpsertProductDocumentDto[]
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
	@ValidateNested({each: true})
	@Type(() => UpsertProductImageDto)
	images?: UpsertProductImageDto[]

	@IsOptional()
	@IsString()
	material?: string | null

	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	weight?: number | null

	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	length?: number | null

	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	width?: number | null

	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	height?: number | null

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

	@IsOptional()
	@ValidateNested()
	@Type(() => UpsertProductMetadataDto)
	metadata?: UpsertProductMetadataDto
}
