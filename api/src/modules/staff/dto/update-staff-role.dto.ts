import {IsIn} from 'class-validator'

export class UpdateStaffRoleDto {
	@IsIn(['owner', 'admin', 'manager'])
	roleCode!: 'owner' | 'admin' | 'manager'
}
