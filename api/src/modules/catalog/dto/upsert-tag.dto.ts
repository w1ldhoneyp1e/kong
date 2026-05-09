import {
	IsHexColor,
	IsOptional,
	IsString,
} from 'class-validator'

export class UpsertTagDto {
	@IsString()
	value!: string

	@IsOptional()
	@IsHexColor()
	color?: string
}
