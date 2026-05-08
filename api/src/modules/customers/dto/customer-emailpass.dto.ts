import {
	IsEmail,
	IsString,
	MinLength,
} from 'class-validator'

export class CustomerEmailpassDto {
	@IsEmail()
	email!: string

	@IsString()
	@MinLength(8)
	password!: string
}
