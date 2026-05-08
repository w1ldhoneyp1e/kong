import {IsOptional, IsString} from 'class-validator'

export class CreateCartDto {
	@IsOptional()
	@IsString()
	region_id?: string
}
