import {
	IsEmail,
	IsOptional,
	IsString,
} from 'class-validator'

export class CompleteCartDto {
	@IsOptional()
	@IsEmail()
	email?: string

	@IsOptional()
	@IsString()
	first_name?: string

	@IsOptional()
	@IsString()
	last_name?: string

	@IsOptional()
	@IsString()
	phone?: string

	@IsOptional()
	@IsString()
	address_1?: string

	@IsOptional()
	@IsString()
	city?: string

	@IsOptional()
	@IsString()
	postal_code?: string

	@IsOptional()
	@IsString()
	country_code?: string
}
