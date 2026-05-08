import {Injectable} from '@nestjs/common'
import {mkdir, readFile, writeFile} from 'node:fs/promises'
import path from 'node:path'
import {CreateCartDto} from '../dto/create-cart.dto'
import {CartRepository} from './cart.repository'
import {Cart} from '../types/cart.types'

function resolveApiDataPath(fileName: string): string {
	const cwd = process.cwd()
	const apiRoot = path.basename(cwd) === 'api'
		? cwd
		: path.resolve(cwd, 'api')
	return path.resolve(apiRoot, 'data', fileName)
}

const CARTS_FILE_PATH = resolveApiDataPath('carts.json')

type CartStore = {
	carts: Cart[],
}

@Injectable()
export class FileCartRepository extends CartRepository {
	private static writeQueue = Promise.resolve()

	async getCartById(id: string): Promise<Cart | null> {
		const store = await this.readStore()
		return store.carts.find(cart => cart.id === id) ?? null
	}

	async createCart(input: CreateCartDto): Promise<Cart> {
		return this.mutateStore(store => {
			const cart: Cart = {
				id: this.createId(),
				region_id: input.region_id ?? null,
				items: [],
				total: 0,
				item_total: 0,
				shipping_total: 0,
			}
			store.carts.unshift(cart)
			return {
				nextStore: store,
				result: cart,
			}
		})
	}

	async updateCart(cart: Cart): Promise<Cart> {
		return this.mutateStore(store => {
			const index = store.carts.findIndex(item => item.id === cart.id)
			if (index < 0) {
				store.carts.unshift(cart)
			}
			else {
				store.carts[index] = cart
			}
			return {
				nextStore: store,
				result: cart,
			}
		})
	}

	async deleteCart(id: string): Promise<boolean> {
		return this.mutateStore(store => {
			const nextCarts = store.carts.filter(cart => cart.id !== id)
			return {
				nextStore: {carts: nextCarts},
				result: nextCarts.length !== store.carts.length,
			}
		})
	}

	private async readStore(): Promise<CartStore> {
		try {
			const content = await readFile(CARTS_FILE_PATH, 'utf8')
			const parsed = JSON.parse(content) as CartStore
			return Array.isArray(parsed.carts)
				? parsed
				: {carts: []}
		}
		catch {
			return {carts: []}
		}
	}

	private async writeStore(store: CartStore): Promise<void> {
		await mkdir(path.dirname(CARTS_FILE_PATH), {recursive: true})
		await writeFile(CARTS_FILE_PATH, `${JSON.stringify(store, null, 2)}\n`, 'utf8')
	}

	private async mutateStore<T>(mutator: (store: CartStore) => {
		nextStore: CartStore,
		result: T,
	}): Promise<T> {
		const operation = FileCartRepository.writeQueue.then(async () => {
			const store = await this.readStore()
			const {
				nextStore,
				result,
			} = mutator(store)
			await this.writeStore(nextStore)
			return result
		})
		FileCartRepository.writeQueue = operation.then(() => undefined, () => undefined)
		return operation
	}

	private createId(): string {
		return `cart_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`
	}
}
