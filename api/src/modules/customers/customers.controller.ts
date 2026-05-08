import {
	Body,
	Controller,
	Delete,
	Get,
	Headers,
	HttpCode,
	Param,
	Post,
	Put,
	Query,
	UnauthorizedException,
} from '@nestjs/common'
import {CustomersService} from './customers.service'
import {CreateCustomerDto} from './dto/create-customer.dto'
import {ListCustomersQueryDto} from './dto/list-customers-query.dto'
import {UpdateCustomerDto} from './dto/update-customer.dto'

@Controller('customers')
export class CustomersController {
	constructor(
		private readonly customersService: CustomersService,
	) {}

	@Get()
	listCustomers(
		@Headers('authorization') authorization: string | undefined,
		@Query() query: ListCustomersQueryDto,
	) {
		return this.customersService.listCustomers(this.extractBearerToken(authorization), query)
	}

	@Post()
	createCustomer(
		@Headers('authorization') authorization: string | undefined,
		@Body() input: CreateCustomerDto,
	) {
		return this.customersService.createCustomer(this.extractBearerToken(authorization), input)
	}

	@Get(':id/orders')
	listCustomerOrders(
		@Headers('authorization') authorization: string | undefined,
		@Param('id') id: string,
		@Query() query: {limit?: number, offset?: number},
	) {
		return this.customersService.listCustomerOrders(
			this.extractBearerToken(authorization),
			id,
			query,
		)
	}

	@Get(':id')
	getCustomer(
		@Headers('authorization') authorization: string | undefined,
		@Param('id') id: string,
	) {
		return this.customersService.getCustomer(this.extractBearerToken(authorization), id)
	}

	@Put(':id')
	updateCustomer(
		@Headers('authorization') authorization: string | undefined,
		@Param('id') id: string,
		@Body() input: UpdateCustomerDto,
	) {
		return this.customersService.updateCustomer(this.extractBearerToken(authorization), id, input)
	}

	@Delete(':id')
	@HttpCode(204)
	async deleteCustomer(
		@Headers('authorization') authorization: string | undefined,
		@Param('id') id: string,
	): Promise<void> {
		await this.customersService.deleteCustomer(this.extractBearerToken(authorization), id)
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
