import {Injectable} from '@nestjs/common'
import {mkdir, readFile, writeFile} from 'node:fs/promises'
import {randomBytes} from 'node:crypto'
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
	customers: Array<Customer & {passwordHash?: string | null}>,
	sessions: Array<{
		token: string,
		customerId: string,
		expires_at: string,
	}>,
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
		const customer = await this.getCustomerAccountByEmail(email)
		return customer
			? this.toPublicCustomer(customer)
			: null
	}

	async getCustomerAccountByEmail(
		email: string,
	): Promise<(Customer & {passwordHash?: string | null}) | null> {
		const normalized = email.trim().toLowerCase()
		const store = await this.readStore()
		return store.customers.find(customer => customer.email.toLowerCase() === normalized) ?? null
	}

	async createCustomerAccount(input: {
		email: string,
		passwordHash: string,
		first_name?: string | null,
		last_name?: string | null,
	}): Promise<{token: string, customer: Customer}> {
		return this.mutateStore(store => {
			const now = new Date().toISOString()
			const customer: Customer & {passwordHash?: string | null} = {
				id: this.createId(),
				email: input.email.trim().toLowerCase(),
				first_name: this.normalizeValue(input.first_name),
				last_name: this.normalizeValue(input.last_name),
				created_at: now,
				updated_at: now,
				has_account: true,
				passwordHash: input.passwordHash,
			}
			const session = this.createSession(customer.id)
			store.customers.unshift(customer)
			store.sessions.unshift(session)
			return {
				nextStore: store,
				result: {
					token: session.token,
					customer: this.toPublicCustomer(customer),
				},
			}
		})
	}

	async createCustomerSession(customerId: string): Promise<{token: string}> {
		return this.mutateStore(store => {
			const session = this.createSession(customerId)
			store.sessions.unshift(session)
			return {
				nextStore: {
					customers: store.customers,
					sessions: this.cleanupSessions(store.sessions),
				},
				result: {token: session.token},
			}
		})
	}

	async getCustomerByToken(token: string): Promise<Customer | null> {
		const store = await this.readStore()
		const session = this.cleanupSessions(store.sessions).find(item => item.token === token)
		if (!session) {
			return null
		}

		const customer = store.customers.find(item => item.id === session.customerId)
		return customer
			? this.toPublicCustomer(customer)
			: null
	}

	async createCustomer(input: CreateCustomerDto): Promise<Customer> {
		return this.mutateStore(store => {
			const now = new Date().toISOString()
			const customer: Customer & {passwordHash?: string | null} = {
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
				result: this.toPublicCustomer(customer),
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

			const updated: Customer & {passwordHash?: string | null} = {
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
				result: this.toPublicCustomer(updated),
			}
		})
	}

	async deleteCustomer(id: string): Promise<boolean> {
		return this.mutateStore(store => {
			const nextCustomers = store.customers.filter(customer => customer.id !== id)
			return {
				nextStore: {
					customers: nextCustomers,
					sessions: store.sessions.filter(session => session.customerId !== id),
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
				? {
					customers: parsed.customers,
					sessions: Array.isArray(parsed.sessions)
						? this.cleanupSessions(parsed.sessions)
						: [],
				}
				: {
					customers: [],
					sessions: [],
				}
		}
		catch {
			return {
				customers: [],
				sessions: [],
			}
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

	private createSession(customerId: string): {
		token: string,
		customerId: string,
		expires_at: string,
	} {
		return {
			token: `cust_tok_${randomBytes(24).toString('hex')}`,
			customerId,
			expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
		}
	}

	private cleanupSessions(sessions: Array<{
		token: string,
		customerId: string,
		expires_at: string,
	}>): Array<{
		token: string,
		customerId: string,
		expires_at: string,
	}> {
		const now = Date.now()
		return sessions.filter(session => new Date(session.expires_at).getTime() > now)
	}

	private normalizeValue(value?: string | null): string | null {
		const normalized = value?.trim()
		return normalized
			? normalized
			: null
	}

	private toPublicCustomer(customer: Customer & {passwordHash?: string | null}): Customer {
		const {passwordHash: _passwordHash, ...publicCustomer} = customer
		return publicCustomer
	}
}
