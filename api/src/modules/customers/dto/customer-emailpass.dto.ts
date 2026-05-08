import {
	IsEmail,
	IsOptional,
	IsString,
	MinLength,
} from 'class-validator'

export class CustomerEmailpassDto {
	@IsEmail()
	email!: string

	@IsString()
	@MinLength(8)
	password!: string

	@IsOptional()
	@IsString()
	first_name?: string

	@IsOptional()
	@IsString()
	last_name?: string
}
