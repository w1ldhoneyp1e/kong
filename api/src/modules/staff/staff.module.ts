import {Module} from '@nestjs/common'
import {FileStaffRepository} from './repositories/file-staff.repository'
import {StaffRepository} from './repositories/staff.repository'
import {StaffController} from './staff.controller'
import {StaffService} from './staff.service'

@Module({
	controllers: [StaffController],
	providers: [
		StaffService,
		{
			provide: StaffRepository,
			useClass: FileStaffRepository,
		},
	],
	exports: [StaffService, StaffRepository],
})
export class StaffModule {}
