import {Injectable} from '@nestjs/common'
import {mkdir, readFile, writeFile} from 'node:fs/promises'
import path from 'node:path'
import {CreateCustomerDto} from '../dto/create-customer.dto'
import {ListCustomersQueryDto} from '../dto/list-customers-query.dto'
import {UpdateCustomerDto} from '../dto/update-customer.dto'
import {CustomerRepository} from './customer.repository'
import {Customer} from '../types/customer.types'

function resolveApiDataPath(fileName: string): string {
	const cwd = process.cwd()
	const apiRoot = path.basename(cwd) === 'api'
		? cwd
		: path.resolve(cwd, 'api')
	return path.resolve(apiRoot, 'data', fileName)
}

const CUSTOMERS_FILE_PATH = resolveApiDataPath('customers.json')

type CustomerStore = {
	customers: Customer[],
}

@Injectable()
export class FileCustomerRepository extends CustomerRepository {
	private static writeQueue = Promise.resolve()

	async listCustomers(query?: ListCustomersQueryDto): Promise<Customer[]> {
		const filtered = await this.filterCustomers(query)
		const offset = query?.offset ?? 0
		const limit = query?.limit

		return limit === undefined
			? filtered.slice(offset)
			: filtered.slice(offset, offset + limit)
	}

	async countCustomers(query?: ListCustomersQueryDto): Promise<number> {
		const filtered = await this.filterCustomers(query)
		return filtered.length
	}

	async getCustomerById(id: string): Promise<Customer | null> {
		const store = await this.readStore()
		return store.customers.find(customer => customer.id === id) ?? null
	}

	async getCustomerByEmail(email: string): Promise<Customer | null> {
		const normalized = email.trim().toLowerCase()
		const store = await this.readStore()
		return store.customers.find(customer => customer.email.toLowerCase() === normalized) ?? null
	}

	async createCustomer(input: CreateCustomerDto): Promise<Customer> {
		return this.mutateStore(store => {
			const now = new Date().toISOString()
			const customer: Customer = {
				id: this.createId(),
				email: input.email.trim().toLowerCase(),
				first_name: this.normalizeValue(input.first_name),
				last_name: this.normalizeValue(input.last_name),
				created_at: now,
				updated_at: now,
				has_account: true,
			}
			store.customers.unshift(customer)
			return {
				nextStore: store,
				result: customer,
			}
		})
	}

	async updateCustomer(id: string, input: UpdateCustomerDto): Promise<Customer | null> {
		return this.mutateStore(store => {
			const index = store.customers.findIndex(customer => customer.id === id)
			if (index < 0) {
				return {
					nextStore: store,
					result: null,
				}
			}

			const existing = store.customers[index]
			if (!existing) {
				return {
					nextStore: store,
					result: null,
				}
			}

			const updated: Customer = {
				...existing,
				email: input.email === undefined || input.email === null
					? existing.email
					: input.email.trim().toLowerCase(),
				first_name: input.first_name === undefined
					? existing.first_name
					: this.normalizeValue(input.first_name),
				last_name: input.last_name === undefined
					? existing.last_name
					: this.normalizeValue(input.last_name),
				updated_at: new Date().toISOString(),
			}
			store.customers[index] = updated
			return {
				nextStore: store,
				result: updated,
			}
		})
	}

	async deleteCustomer(id: string): Promise<boolean> {
		return this.mutateStore(store => {
			const nextCustomers = store.customers.filter(customer => customer.id !== id)
			return {
				nextStore: {
					customers: nextCustomers,
				},
				result: nextCustomers.length !== store.customers.length,
			}
		})
	}

	private async filterCustomers(query?: ListCustomersQueryDto): Promise<Customer[]> {
		const store = await this.readStore()
		const search = query?.q?.trim().toLowerCase()
		const customers = [...store.customers].sort((a, b) => (b.created_at ?? '').localeCompare(a.created_at ?? ''))

		if (!search) {
			return customers
		}

		return customers.filter(customer =>
			customer.email.toLowerCase().includes(search)
			|| (customer.first_name ?? '').toLowerCase().includes(search)
			|| (customer.last_name ?? '').toLowerCase().includes(search),
		)
	}

	private async readStore(): Promise<CustomerStore> {
		try {
			const content = await readFile(CUSTOMERS_FILE_PATH, 'utf8')
			const parsed = JSON.parse(content) as CustomerStore
			return Array.isArray(parsed.customers)
				? parsed
				: {customers: []}
		}
		catch {
			return {customers: []}
		}
	}

	private async writeStore(store: CustomerStore): Promise<void> {
		await mkdir(path.dirname(CUSTOMERS_FILE_PATH), {recursive: true})
		await writeFile(CUSTOMERS_FILE_PATH, `${JSON.stringify(store, null, 2)}\n`, 'utf8')
	}

	private async mutateStore<T>(mutator: (store: CustomerStore) => {
		nextStore: CustomerStore,
		result: T,
	}): Promise<T> {
		const operation = FileCustomerRepository.writeQueue.then(async () => {
			const store = await this.readStore()
			const {
				nextStore,
				result,
			} = mutator(store)
			await this.writeStore(nextStore)
			return result
		})
		FileCustomerRepository.writeQueue = operation.then(() => undefined, () => undefined)
		return operation
	}

	private createId(): string {
		return `cus_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`
	}

	private normalizeValue(value?: string | null): string | null {
		const normalized = value?.trim()
		return normalized
			? normalized
			: null
	}
}
