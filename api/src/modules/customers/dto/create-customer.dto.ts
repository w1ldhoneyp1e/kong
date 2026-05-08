import {
	IsEmail,
	IsOptional,
	IsString,
} from 'class-validator'

export class CreateCustomerDto {
	@IsEmail()
	email!: string

	@IsOptional()
	@IsString()
	first_name?: string | null

	@IsOptional()
	@IsString()
	last_name?: string | null
}
