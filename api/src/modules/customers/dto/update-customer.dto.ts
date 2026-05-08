import {
	IsEmail,
	IsOptional,
	IsString,
} from 'class-validator'

export class UpdateCustomerDto {
	@IsOptional()
	@IsEmail()
	email?: string | null

	@IsOptional()
	@IsString()
	first_name?: string | null

	@IsOptional()
	@IsString()
	last_name?: string | null
}
