import {Module} from '@nestjs/common'
import {StaffModule} from '../staff/staff.module'
import {PagesController} from './pages.controller'
import {PagesService} from './pages.service'
import {ContentPageRepository} from './repositories/content-page.repository'
import {FileContentPageRepository} from './repositories/file-content-page.repository'

@Module({
	imports: [StaffModule],
	controllers: [PagesController],
	providers: [
		PagesService,
		{
			provide: ContentPageRepository,
			useClass: FileContentPageRepository,
		},
	],
	exports: [PagesService],
})
export class PagesModule {}
