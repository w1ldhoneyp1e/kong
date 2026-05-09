import {
	Body,
	Controller,
	Get,
	Headers,
	Param,
	Put,
	UnauthorizedException,
} from '@nestjs/common'
import {UpdateContentPageDto} from './dto/update-content-page.dto'
import {PagesService} from './pages.service'

@Controller('pages')
export class PagesController {
	constructor(
		private readonly pagesService: PagesService,
	) {}

	@Get()
	listPages() {
		return this.pagesService.listPages()
	}

	@Get(':slug')
	getPageBySlug(@Param('slug') slug: string) {
		return this.pagesService.getPageBySlug(slug)
	}

	@Put(':slug')
	updatePage(
		@Param('slug') slug: string,
		@Headers('authorization') authorization: string | undefined,
		@Body() input: UpdateContentPageDto,
	) {
		return this.pagesService.updatePage(this.extractBearerToken(authorization), slug, input)
	}

	private extractBearerToken(authorization?: string): string {
		if (!authorization) {
			throw new UnauthorizedException('Не задан Authorization header')
		}

		const [type, token] = authorization.split(' ')
		if (type?.toLowerCase() !== 'bearer' || !token) {
			throw new UnauthorizedException('Некорректный Authorization header')
		}

		return token
	}
}
