import {
	ForbiddenException,
	Inject,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common'
import {CreateStaffUserDto} from './dto/create-staff-user.dto'
import {UpdateStaffRoleDto} from './dto/update-staff-role.dto'
import {FileStaffRepository} from './repositories/file-staff.repository'
import {StaffRepository} from './repositories/staff.repository'
import {
	ListStaffUsersResponse,
	StaffMeResponse,
	StaffRoleCode,
	StaffUser,
} from './types/staff.types'

type SafeStaffUser = Omit<StaffUser, 'passwordHash'>

@Injectable()
export class StaffService {
	constructor(
		@Inject(StaffRepository)
		private readonly staffRepository: StaffRepository,
	) {}

	async login(email: string, password: string): Promise<{token: string}> {
		const user = await this.staffRepository.getUserByEmail(email)
		if (!user || !FileStaffRepository.verifyPassword(password, user.passwordHash)) {
			throw new UnauthorizedException('Неверный email или пароль')
		}

		const session = FileStaffRepository.createSessionForUser(user.id)
		await this.staffRepository.createSession(session)

		return {token: session.token}
	}

	async getStaffMe(token: string): Promise<StaffMeResponse> {
		const user = await this.requireUserByToken(token)
		return {
			staff: {
				id: user.id,
				email: user.email,
				roleCode: user.roleCode,
			},
			permissions: this.permissionsForRole(user.roleCode),
		}
	}

	async requirePermission(token: string, permission: string): Promise<StaffUser> {
		const user = await this.requireUserByToken(token)
		if (!this.permissionsForRole(user.roleCode).includes(permission)) {
			throw new ForbiddenException('Недостаточно прав')
		}

		return user
	}

	async listUsers(token: string): Promise<ListStaffUsersResponse> {
		const viewer = await this.requireUserByToken(token)
		this.assertCanManageStaff(viewer)

		const users = await this.staffRepository.listUsers()
		return {
			users: users.map(user => this.toSafeUser(user)),
			count: users.length,
		}
	}

	async getUserById(token: string, id: string): Promise<{user: SafeStaffUser}> {
		const viewer = await this.requireUserByToken(token)
		this.assertCanManageStaff(viewer)

		const user = await this.staffRepository.getUserById(id)
		if (!user) {
			throw new NotFoundException('Пользователь не найден')
		}

		return {user: this.toSafeUser(user)}
	}

	async createUser(token: string, input: CreateStaffUserDto): Promise<SafeStaffUser> {
		const viewer = await this.requireUserByToken(token)
		this.assertCanManageStaff(viewer)

		const email = input.email.trim().toLowerCase()
		const existing = await this.staffRepository.getUserByEmail(email)
		if (existing) {
			throw new ForbiddenException('Пользователь с таким email уже существует')
		}

		const requestedRole = input.roleCode ?? 'manager'
		if (requestedRole === 'admin' && viewer.roleCode !== 'owner') {
			throw new ForbiddenException('Только владелец может назначать админа')
		}

		const user = await this.staffRepository.createUser({
			...input,
			email,
			roleCode: requestedRole,
			passwordHash: FileStaffRepository.hashPassword(input.password),
		})

		return this.toSafeUser(user)
	}

	async updateUserRole(
		token: string,
		id: string,
		input: UpdateStaffRoleDto,
	): Promise<{user: SafeStaffUser}> {
		const viewer = await this.requireUserByToken(token)
		this.assertCanManageStaff(viewer)

		const target = await this.staffRepository.getUserById(id)
		if (!target) {
			throw new NotFoundException('Пользователь не найден')
		}

		if (target.roleCode === 'owner' && viewer.id !== target.id) {
			throw new ForbiddenException('Нельзя изменить роль владельца')
		}

		if (input.roleCode === 'owner' && viewer.roleCode !== 'owner') {
			throw new ForbiddenException('Только владелец может назначать владельца')
		}

		if (input.roleCode === 'admin' && viewer.roleCode !== 'owner') {
			throw new ForbiddenException('Только владелец может назначать админа')
		}

		if (viewer.roleCode !== 'owner' && target.roleCode === 'admin') {
			throw new ForbiddenException('Недостаточно прав для изменения роли админа')
		}

		const updated = await this.staffRepository.updateUserRole(id, input.roleCode)
		if (!updated) {
			throw new NotFoundException('Пользователь не найден')
		}

		return {user: this.toSafeUser(updated)}
	}

	async deleteUser(token: string, id: string): Promise<void> {
		const viewer = await this.requireUserByToken(token)
		this.assertCanManageStaff(viewer)

		const target = await this.staffRepository.getUserById(id)
		if (!target) {
			throw new NotFoundException('Пользователь не найден')
		}

		if (target.roleCode === 'owner') {
			throw new ForbiddenException('Нельзя удалить владельца')
		}

		if (viewer.roleCode !== 'owner' && target.roleCode === 'admin') {
			throw new ForbiddenException('Недостаточно прав для удаления админа')
		}

		await this.staffRepository.deleteUser(id)
	}

	private async requireUserByToken(token: string): Promise<StaffUser> {
		const normalized = token.trim()
		if (!normalized) {
			throw new UnauthorizedException('Не задан staff token')
		}

		const session = await this.staffRepository.getSession(normalized)
		if (!session) {
			throw new UnauthorizedException('Сессия недействительна')
		}

		const user = await this.staffRepository.getUserById(session.userId)
		if (!user) {
			await this.staffRepository.deleteSession(normalized)
			throw new UnauthorizedException('Пользователь не найден')
		}

		return user
	}

	private assertCanManageStaff(user: StaffUser): void {
		if (!this.permissionsForRole(user.roleCode).includes('staff:manage')) {
			throw new ForbiddenException('Недостаточно прав')
		}
	}

	private permissionsForRole(roleCode: StaffRoleCode): string[] {
		if (roleCode === 'owner') {
			return [
				'catalog:manage',
				'orders:manage',
				'customers:manage',
				'staff:manage',
			]
		}

		if (roleCode === 'admin') {
			return [
				'catalog:manage',
				'orders:manage',
				'customers:manage',
				'staff:manage',
			]
		}

		return [
			'catalog:manage',
		]
	}

	private toSafeUser(user: StaffUser): SafeStaffUser {
		const {
			passwordHash: _passwordHash,
			...safeUser
		} = user
		return safeUser
	}
}
