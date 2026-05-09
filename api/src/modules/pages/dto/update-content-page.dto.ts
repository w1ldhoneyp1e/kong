import {
	IsOptional,
	IsString,
} from 'class-validator'

export class UpdateContentPageDto {
	@IsOptional()
	@IsString()
	title?: string

	@IsOptional()
	@IsString()
	description?: string | null

	@IsOptional()
	@IsString()
	body?: string
}
