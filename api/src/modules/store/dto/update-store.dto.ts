import {
	IsBoolean,
	IsOptional,
} from 'class-validator'

export class UpdateStoreDto {
	@IsOptional()
	@IsBoolean()
	commerce_enabled?: boolean
}
