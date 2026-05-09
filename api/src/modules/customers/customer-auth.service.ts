import {
	ConflictException,
	Inject,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common'
import {FileStaffRepository} from '../staff/repositories/file-staff.repository'
import {CustomerRepository} from './repositories/customer.repository'
import {Customer} from './types/customer.types'

@Injectable()
export class CustomerAuthService {
	constructor(
		@Inject(CustomerRepository)
		private readonly customerRepository: CustomerRepository,
	) {}

	async register(params: {
		email: string,
		password: string,
		first_name?: string | null,
		last_name?: string | null,
	}): Promise<{token: string, customer: Customer}> {
		const existing = await this.customerRepository.getCustomerAccountByEmail(params.email)
		if (existing) {
			throw new ConflictException('Покупатель с таким email уже существует')
		}

		return this.customerRepository.createCustomerAccount({
			...params,
			passwordHash: FileStaffRepository.hashPassword(params.password),
		})
	}

	async login(email: string, password: string): Promise<{token: string}> {
		const account = await this.customerRepository.getCustomerAccountByEmail(email)
		if (!account?.passwordHash) {
			throw new UnauthorizedException('Неверный email или пароль')
		}

		if (!FileStaffRepository.verifyPassword(password, account.passwordHash)) {
			throw new UnauthorizedException('Неверный email или пароль')
		}

		return this.customerRepository.createCustomerSession(account.id)
	}

	async getCustomerByToken(token: string): Promise<Customer> {
		const customer = await this.customerRepository.getCustomerByToken(token)
		if (!customer) {
			throw new UnauthorizedException('Сессия покупателя недействительна')
		}

		return customer
	}
}
