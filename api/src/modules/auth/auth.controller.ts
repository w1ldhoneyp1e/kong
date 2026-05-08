import {Body, Controller, HttpCode, Post} from '@nestjs/common'
import {AuthService} from './auth.service'
import {StaffLoginDto} from './dto/staff-login.dto'

@Controller('staff')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
	) {}

	@Post('login')
	@HttpCode(501)
	login(
		@Body() input: StaffLoginDto,
	): {message: string, email: string} {
		return this.authService.login(input)
	}
}
