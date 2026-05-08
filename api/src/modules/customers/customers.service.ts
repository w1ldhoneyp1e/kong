import {
	ConflictException,
	Inject,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import {OrdersService} from '../orders/orders.service'
import {StaffService} from '../staff/staff.service'
import {CreateCustomerDto} from './dto/create-customer.dto'
import {ListCustomersQueryDto} from './dto/list-customers-query.dto'
import {UpdateCustomerDto} from './dto/update-customer.dto'
import {CustomerRepository} from './repositories/customer.repository'

@Injectable()
export class CustomersService {
	constructor(
		private readonly staffService: StaffService,
		private readonly ordersService: OrdersService,
		@Inject(CustomerRepository)
		private readonly customerRepository: CustomerRepository,
	) {}

	async listCustomers(token: string, query?: ListCustomersQueryDto) {
		await this.staffService.requirePermission(token, 'customers:manage')
		const [customers, count] = await Promise.all([
			this.customerRepository.listCustomers(query),
			this.customerRepository.countCustomers(query),
		])
		return {
			customers,
			count,
		}
	}

	async getCustomer(token: string, id: string) {
		await this.staffService.requirePermission(token, 'customers:manage')
		const customer = await this.customerRepository.getCustomerById(id)
		if (!customer) {
			throw new NotFoundException('Покупатель не найден')
		}

		return {customer}
	}

	async createCustomer(token: string, input: CreateCustomerDto) {
		await this.staffService.requirePermission(token, 'customers:manage')
		const existing = await this.customerRepository.getCustomerByEmail(input.email)
		if (existing) {
			throw new ConflictException('Покупатель с таким email уже существует')
		}

		return {
			customer: await this.customerRepository.createCustomer(input),
		}
	}

	async updateCustomer(token: string, id: string, input: UpdateCustomerDto) {
		await this.staffService.requirePermission(token, 'customers:manage')
		if (input.email !== undefined && input.email !== null && input.email.trim().length === 0) {
			throw new ConflictException('Email не может быть пустым')
		}

		const existing = input.email
			? await this.customerRepository.getCustomerByEmail(input.email)
			: null
		if (existing && existing.id !== id) {
			throw new ConflictException('Покупатель с таким email уже существует')
		}

		const customer = await this.customerRepository.updateCustomer(id, input)
		if (!customer) {
			throw new NotFoundException('Покупатель не найден')
		}

		return {customer}
	}

	async deleteCustomer(token: string, id: string): Promise<void> {
		await this.staffService.requirePermission(token, 'customers:manage')
		const deleted = await this.customerRepository.deleteCustomer(id)
		if (!deleted) {
			throw new NotFoundException('Покупатель не найден')
		}
	}

	async listCustomerOrders(
		token: string,
		customerId: string,
		query?: {
			limit?: number,
			offset?: number,
		},
	) {
		await this.staffService.requirePermission(token, 'customers:manage')
		const customer = await this.customerRepository.getCustomerById(customerId)
		if (!customer) {
			throw new NotFoundException('Покупатель не найден')
		}

		return this.ordersService.listOrdersByCustomerId(token, customerId, query)
	}
}
