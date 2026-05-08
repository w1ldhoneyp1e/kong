import {
	Controller,
	Get,
	Headers,
	UnauthorizedException,
} from '@nestjs/common'
import {CustomerAuthService} from '../customer-auth.service'

@Controller()
export class CustomerMeController {
	constructor(
		private readonly customerAuthService: CustomerAuthService,
	) {}

	@Get('customer/me')
	async customerMe(
		@Headers('authorization') authorization: string | undefined,
	) {
		const customer = await this.customerAuthService.getCustomerByToken(
			this.extractBearerToken(authorization),
		)

		return {customer}
	}

	@Get('store/customers/me')
	async storeCustomerMe(
		@Headers('authorization') authorization: string | undefined,
	) {
		const customer = await this.customerAuthService.getCustomerByToken(
			this.extractBearerToken(authorization),
		)

		return {customer}
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
