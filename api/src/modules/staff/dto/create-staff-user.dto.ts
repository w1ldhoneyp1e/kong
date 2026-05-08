import {
	IsEmail,
	IsIn,
	IsOptional,
	IsString,
	MinLength,
} from 'class-validator'

export class CreateStaffUserDto {
	@IsEmail()
	email!: string

	@IsString()
	@MinLength(8)
	password!: string

	@IsOptional()
	@IsString()
	first_name?: string | null

	@IsOptional()
	@IsString()
	last_name?: string | null

	@IsOptional()
	@IsIn(['admin', 'manager'])
	roleCode?: 'admin' | 'manager'
}
