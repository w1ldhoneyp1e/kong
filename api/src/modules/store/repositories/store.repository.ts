import {UpdateStoreDto} from '../dto/update-store.dto'
import {StoreSettings} from '../types/store.types'

abstract class StoreRepository {
	abstract getStore(): Promise<StoreSettings>
	abstract updateStore(input: UpdateStoreDto): Promise<StoreSettings>
}

export {StoreRepository}
