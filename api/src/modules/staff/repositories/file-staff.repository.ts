import {Injectable} from '@nestjs/common'
import {mkdir, readFile, writeFile} from 'node:fs/promises'
import {randomBytes, scryptSync, timingSafeEqual} from 'node:crypto'
import path from 'node:path'
import {CreateStaffUserDto} from '../dto/create-staff-user.dto'
import {StaffRepository} from './staff.repository'
import {StaffSession, StaffUser} from '../types/staff.types'

function resolveApiDataPath(fileName: string): string {
	const cwd = process.cwd()
	const apiRoot = path.basename(cwd) === 'api'
		? cwd
		: path.resolve(cwd, 'api')
	return path.resolve(apiRoot, 'data', fileName)
}

const STAFF_FILE_PATH = resolveApiDataPath('staff-users.json')
const SESSION_TTL_MS = 1000 * 60 * 60 * 8

type StaffStore = {
	users: StaffUser[],
	sessions: StaffSession[],
}

@Injectable()
export class FileStaffRepository extends StaffRepository {
	private static writeQueue = Promise.resolve()

	async listUsers(): Promise<StaffUser[]> {
		const store = await this.readStore()
		return [...store.users].sort((a, b) => (b.created_at ?? '').localeCompare(a.created_at ?? ''))
	}

	async getUserById(id: string): Promise<StaffUser | null> {
		const store = await this.readStore()
		return store.users.find(user => user.id === id) ?? null
	}

	async getUserByEmail(email: string): Promise<StaffUser | null> {
		const normalized = email.trim().toLowerCase()
		const store = await this.readStore()
		return store.users.find(user => user.email.toLowerCase() === normalized) ?? null
	}

	async createUser(input: CreateStaffUserDto & {
		roleCode: StaffUser['roleCode'],
		passwordHash: string,
	}): Promise<StaffUser> {
		return this.mutateStore(store => {
			const now = new Date().toISOString()
			const user: StaffUser = {
				id: this.createId('staff'),
				email: input.email.trim().toLowerCase(),
				first_name: this.normalizeName(input.first_name),
				last_name: this.normalizeName(input.last_name),
				roleCode: input.roleCode,
				passwordHash: input.passwordHash,
				created_at: now,
			}
			store.users.unshift(user)
			return {
				nextStore: store,
				result: user,
			}
		})
	}

	async updateUserRole(id: string, roleCode: StaffUser['roleCode']): Promise<StaffUser | null> {
		return this.mutateStore(store => {
			const index = store.users.findIndex(user => user.id === id)
			if (index < 0) {
				return {
					nextStore: store,
					result: null,
				}
			}

			const existing = store.users[index]
			if (!existing) {
				return {
					nextStore: store,
					result: null,
				}
			}

			const updated: StaffUser = {
				...existing,
				roleCode,
			}
			store.users[index] = updated
			return {
				nextStore: store,
				result: updated,
			}
		})
	}

	async deleteUser(id: string): Promise<boolean> {
		return this.mutateStore(store => {
			const nextUsers = store.users.filter(user => user.id !== id)
			if (nextUsers.length === store.users.length) {
				return {
					nextStore: store,
					result: false,
				}
			}

			return {
				nextStore: {
					users: nextUsers,
					sessions: store.sessions.filter(session => session.userId !== id),
				},
				result: true,
			}
		})
	}

	async createSession(session: StaffSession): Promise<void> {
		await this.mutateStore(store => {
			const activeSessions = this.cleanupSessions(store.sessions)
			return {
				nextStore: {
					users: store.users,
					sessions: [session, ...activeSessions.filter(item => item.token !== session.token)],
				},
				result: undefined,
			}
		})
	}

	async getSession(token: string): Promise<StaffSession | null> {
		const store = await this.readStore()
		const sessions = this.cleanupSessions(store.sessions)
		const session = sessions.find(item => item.token === token) ?? null
		if (sessions.length !== store.sessions.length) {
			await this.writeStore({
				users: store.users,
				sessions,
			})
		}
		return session
	}

	async deleteSession(token: string): Promise<void> {
		await this.mutateStore(store => ({
			nextStore: {
				users: store.users,
				sessions: store.sessions.filter(session => session.token !== token),
			},
			result: undefined,
		}))
	}

	static hashPassword(password: string): string {
		const salt = randomBytes(16).toString('hex')
		const hash = scryptSync(password, salt, 64).toString('hex')
		return `${salt}:${hash}`
	}

	static verifyPassword(password: string, passwordHash: string): boolean {
		const [salt, storedHash] = passwordHash.split(':')
		if (!salt || !storedHash) {
			return false
		}

		const hashBuffer = Buffer.from(storedHash, 'hex')
		const candidateBuffer = scryptSync(password, salt, hashBuffer.length)
		return timingSafeEqual(hashBuffer, candidateBuffer)
	}

	static createSessionForUser(userId: string): StaffSession {
		const createdAt = new Date()
		return {
			token: `staff_tok_${randomBytes(24).toString('hex')}`,
			userId,
			created_at: createdAt.toISOString(),
			expires_at: new Date(createdAt.getTime() + SESSION_TTL_MS).toISOString(),
		}
	}

	private async readStore(): Promise<StaffStore> {
		try {
			const content = await readFile(STAFF_FILE_PATH, 'utf8')
			const parsed = JSON.parse(content) as StaffStore
			const users = Array.isArray(parsed.users)
				? parsed.users
				: []
			const sessions = Array.isArray(parsed.sessions)
				? parsed.sessions
				: []
			const seededUsers = this.ensureSeedUser(users)
			return {
				users: seededUsers,
				sessions: this.cleanupSessions(sessions),
			}
		}
		catch {
			return {
				users: this.ensureSeedUser([]),
				sessions: [],
			}
		}
	}

	private async writeStore(store: StaffStore): Promise<void> {
		await mkdir(path.dirname(STAFF_FILE_PATH), {recursive: true})
		await writeFile(STAFF_FILE_PATH, `${JSON.stringify(store, null, 2)}\n`, 'utf8')
	}

	private async mutateStore<T>(mutator: (store: StaffStore) => {
		nextStore: StaffStore,
		result: T,
	}): Promise<T> {
		const operation = FileStaffRepository.writeQueue.then(async () => {
			const store = await this.readStore()
			const {
				nextStore,
				result,
			} = mutator(store)
			await this.writeStore(nextStore)
			return result
		})
		FileStaffRepository.writeQueue = operation.then(() => undefined, () => undefined)
		return operation
	}

	private ensureSeedUser(users: StaffUser[]): StaffUser[] {
		if (users.length > 0) {
			return users
		}

		const email = (process.env.SEED_STAFF_EMAIL ?? 'owner@kong.local').trim().toLowerCase()
		const password = process.env.SEED_STAFF_PASSWORD ?? 'password123'
		return [{
			id: 'staff_owner_seed',
			email,
			first_name: 'Owner',
			last_name: null,
			roleCode: 'owner',
			passwordHash: FileStaffRepository.hashPassword(password),
			created_at: new Date().toISOString(),
		}]
	}

	private cleanupSessions(sessions: StaffSession[]): StaffSession[] {
		const now = Date.now()
		return sessions.filter(session => new Date(session.expires_at).getTime() > now)
	}

	private createId(prefix: string): string {
		return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`
	}

	private normalizeName(value?: string | null): string | null {
		const normalized = value?.trim()
		return normalized
			? normalized
			: null
	}
}
