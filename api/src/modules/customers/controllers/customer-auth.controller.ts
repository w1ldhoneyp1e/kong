import {
	Body,
	Controller,
	Post,
} from '@nestjs/common'
import {CustomerEmailpassDto} from '../dto/customer-emailpass.dto'
import {CustomerAuthService} from '../customer-auth.service'

@Controller('auth/customer/emailpass')
export class CustomerAuthController {
	constructor(
		private readonly customerAuthService: CustomerAuthService,
	) {}

	@Post()
	login(
		@Body() input: CustomerEmailpassDto,
	) {
		return this.customerAuthService.login(input.email, input.password)
	}

	@Post('register')
	async register(
		@Body() input: CustomerEmailpassDto,
	) {
		const result = await this.customerAuthService.register({
			email: input.email,
			password: input.password,
		})

		return {
			token: result.token,
		}
	}
}
