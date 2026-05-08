import {CreateStaffUserDto} from '../dto/create-staff-user.dto'
import {StaffSession, StaffUser} from '../types/staff.types'

abstract class StaffRepository {
	abstract listUsers(): Promise<StaffUser[]>
	abstract getUserById(id: string): Promise<StaffUser | null>
	abstract getUserByEmail(email: string): Promise<StaffUser | null>
	abstract createUser(input: CreateStaffUserDto & {
		roleCode: StaffUser['roleCode'],
		passwordHash: string,
	}): Promise<StaffUser>
	abstract updateUserRole(id: string, roleCode: StaffUser['roleCode']): Promise<StaffUser | null>
	abstract deleteUser(id: string): Promise<boolean>
	abstract createSession(session: StaffSession): Promise<void>
	abstract getSession(token: string): Promise<StaffSession | null>
	abstract deleteSession(token: string): Promise<void>
}

export {StaffRepository}
