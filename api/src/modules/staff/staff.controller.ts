import {
	Body,
	Controller,
	Delete,
	Get,
	Headers,
	HttpCode,
	Param,
	Patch,
	Post,
	UnauthorizedException,
} from '@nestjs/common'
import {CreateStaffUserDto} from './dto/create-staff-user.dto'
import {UpdateStaffRoleDto} from './dto/update-staff-role.dto'
import {StaffService} from './staff.service'

@Controller('staff')
export class StaffController {
	constructor(
		private readonly staffService: StaffService,
	) {}

	@Post('login')
	login(
		@Body() input: {email: string, password: string},
	): Promise<{token: string}> {
		return this.staffService.login(input.email, input.password)
	}

	@Get('me')
	getMe(
		@Headers('authorization') authorization?: string,
	) {
		return this.staffService.getStaffMe(this.extractBearerToken(authorization))
	}

	@Get('users')
	listUsers(
		@Headers('authorization') authorization?: string,
	) {
		return this.staffService.listUsers(this.extractBearerToken(authorization))
	}

	@Get('users/:id')
	getUserById(
		@Headers('authorization') authorization: string | undefined,
		@Param('id') id: string,
	) {
		return this.staffService.getUserById(this.extractBearerToken(authorization), id)
	}

	@Post('users')
	createUser(
		@Headers('authorization') authorization: string | undefined,
		@Body() input: CreateStaffUserDto,
	) {
		return this.staffService.createUser(this.extractBearerToken(authorization), input)
	}

	@Patch('users/:id')
	updateUserRole(
		@Headers('authorization') authorization: string | undefined,
		@Param('id') id: string,
		@Body() input: UpdateStaffRoleDto,
	) {
		return this.staffService.updateUserRole(this.extractBearerToken(authorization), id, input)
	}

	@Delete('users/:id')
	@HttpCode(204)
	async deleteUser(
		@Headers('authorization') authorization: string | undefined,
		@Param('id') id: string,
	): Promise<void> {
		await this.staffService.deleteUser(this.extractBearerToken(authorization), id)
	}

	private extractBearerToken(authorization?: string): string {
		if (!authorization) {
			throw new UnauthorizedException('Не задан Authorization header')
		}

		const [type, token] = authorization.split(' ')
		if (type?.toLowerCase() !== 'bearer' || !token) {
			throw new UnauthorizedException('Некорректный Authorization header')
		}

		return token
	}
}
