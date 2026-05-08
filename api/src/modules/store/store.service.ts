import {Inject, Injectable} from '@nestjs/common'
import {StaffService} from '../staff/staff.service'
import {UpdateStoreDto} from './dto/update-store.dto'
import {StoreRepository} from './repositories/store.repository'

@Injectable()
export class StoreService {
	constructor(
		@Inject(StoreRepository)
		private readonly storeRepository: StoreRepository,
		private readonly staffService: StaffService,
	) {}

	async getStore() {
		return {
			store: await this.storeRepository.getStore(),
		}
	}

	async updateStore(token: string, input: UpdateStoreDto) {
		await this.staffService.requirePermission(token, 'catalog:manage')
		return {
			store: await this.storeRepository.updateStore(input),
		}
	}
}
