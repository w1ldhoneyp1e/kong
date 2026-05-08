import {Injectable} from '@nestjs/common'
import {mkdir, readFile, writeFile} from 'node:fs/promises'
import path from 'node:path'
import {UpdateStoreDto} from '../dto/update-store.dto'
import {StoreRepository} from './store.repository'
import {StoreSettings} from '../types/store.types'

function resolveApiDataPath(fileName: string): string {
	const cwd = process.cwd()
	const apiRoot = path.basename(cwd) === 'api'
		? cwd
		: path.resolve(cwd, 'api')
	return path.resolve(apiRoot, 'data', fileName)
}

const STORE_FILE_PATH = resolveApiDataPath('store.json')

type StoreFile = {
	store: StoreSettings,
}

@Injectable()
export class FileStoreRepository extends StoreRepository {
	private static writeQueue = Promise.resolve()

	async getStore(): Promise<StoreSettings> {
		const file = await this.readStoreFile()
		return file.store
	}

	async updateStore(input: UpdateStoreDto): Promise<StoreSettings> {
		return this.mutateStore(file => {
			const nextStore: StoreSettings = {
				...file.store,
				name: input.name?.trim() || file.store.name,
				supported_currency_codes: input.supported_currency_codes?.map(code => code.trim().toLowerCase())
					?? file.store.supported_currency_codes,
				default_currency_code: input.default_currency_code?.trim().toLowerCase()
					|| file.store.default_currency_code,
				default_region_id: input.default_region_id === undefined
					? file.store.default_region_id
					: input.default_region_id,
				default_sales_channel_id: input.default_sales_channel_id === undefined
					? file.store.default_sales_channel_id
					: input.default_sales_channel_id,
			}

			return {
				nextFile: {store: nextStore},
				result: nextStore,
			}
		})
	}

	private async readStoreFile(): Promise<StoreFile> {
		try {
			const content = await readFile(STORE_FILE_PATH, 'utf8')
			const parsed = JSON.parse(content) as StoreFile
			if (parsed?.store) {
				return parsed
			}
		}
		catch {}

		return {
			store: {
				id: 'store_default',
				name: 'Kong',
				supported_currency_codes: ['rub'],
				default_currency_code: 'rub',
				default_region_id: null,
				default_sales_channel_id: null,
			},
		}
	}

	private async writeStoreFile(file: StoreFile): Promise<void> {
		await mkdir(path.dirname(STORE_FILE_PATH), {recursive: true})
		await writeFile(STORE_FILE_PATH, `${JSON.stringify(file, null, 2)}\n`, 'utf8')
	}

	private async mutateStore<T>(mutator: (file: StoreFile) => {
		nextFile: StoreFile,
		result: T,
	}): Promise<T> {
		const operation = FileStoreRepository.writeQueue.then(async () => {
			const file = await this.readStoreFile()
			const {
				nextFile,
				result,
			} = mutator(file)
			await this.writeStoreFile(nextFile)
			return result
		})
		FileStoreRepository.writeQueue = operation.then(() => undefined, () => undefined)
		return operation
	}
}
