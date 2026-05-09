import {
	Inject,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import {StaffService} from '../staff/staff.service'
import {UpdateContentPageDto} from './dto/update-content-page.dto'
import {ContentPageRepository} from './repositories/content-page.repository'

@Injectable()
export class PagesService {
	constructor(
		@Inject(ContentPageRepository)
		private readonly contentPageRepository: ContentPageRepository,
		private readonly staffService: StaffService,
	) {}

	async listPages() {
		return {
			pages: await this.contentPageRepository.listPages(),
		}
	}

	async getPageBySlug(slug: string) {
		return {
			page: await this.contentPageRepository.getPageBySlug(slug),
		}
	}

	async updatePage(token: string, slug: string, input: UpdateContentPageDto) {
		await this.staffService.requirePermission(token, 'catalog:manage')
		const page = await this.contentPageRepository.updatePage(slug, input)
		if (!page) {
			throw new NotFoundException('Страница не найдена')
		}

		return {page}
	}
}
