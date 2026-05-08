import {Module} from '@nestjs/common'
import {StaffModule} from '../staff/staff.module'
import {StoreController} from './store.controller'
import {FileStoreRepository} from './repositories/file-store.repository'
import {StoreRepository} from './repositories/store.repository'
import {StoreService} from './store.service'

@Module({
	imports: [StaffModule],
	controllers: [StoreController],
	providers: [
		StoreService,
		{
			provide: StoreRepository,
			useClass: FileStoreRepository,
		},
	],
})
export class StoreModule {}
