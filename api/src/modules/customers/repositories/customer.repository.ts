import {ListCustomersQueryDto} from '../dto/list-customers-query.dto'
import {CreateCustomerDto} from '../dto/create-customer.dto'
import {UpdateCustomerDto} from '../dto/update-customer.dto'
import {Customer} from '../types/customer.types'

abstract class CustomerRepository {
	abstract listCustomers(query?: ListCustomersQueryDto): Promise<Customer[]>
	abstract countCustomers(query?: ListCustomersQueryDto): Promise<number>
	abstract getCustomerById(id: string): Promise<Customer | null>
	abstract getCustomerByEmail(email: string): Promise<Customer | null>
	abstract getCustomerAccountByEmail(email: string): Promise<(Customer & {passwordHash?: string | null}) | null>
	abstract createCustomerAccount(input: {
		email: string,
		passwordHash: string,
		first_name?: string | null,
		last_name?: string | null,
	}): Promise<{token: string, customer: Customer}>
	abstract createCustomerSession(customerId: string): Promise<{token: string}>
	abstract getCustomerByToken(token: string): Promise<Customer | null>
	abstract createCustomer(input: CreateCustomerDto): Promise<Customer>
	abstract updateCustomer(id: string, input: UpdateCustomerDto): Promise<Customer | null>
	abstract deleteCustomer(id: string): Promise<boolean>
}

export {CustomerRepository}
