import {IsIn, IsOptional} from 'class-validator'

export class UpdateOrderDto {
	@IsOptional()
	@IsIn(['pending', 'completed', 'canceled', 'archived', 'requires_action', 'draft'])
	status?: 'pending' | 'completed' | 'canceled' | 'archived' | 'requires_action' | 'draft'
}
