import {
	IsEmail,
	IsOptional,
	IsString,
} from 'class-validator'

export class CustomerEmailpassDto {
	@IsEmail()
	email!: string

	@IsString()
	password!: string

	@IsOptional()
	@IsString()
	first_name?: string

	@IsOptional()
	@IsString()
	last_name?: string
}
