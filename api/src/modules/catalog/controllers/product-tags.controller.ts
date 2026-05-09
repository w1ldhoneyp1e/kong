import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpException,
	HttpStatus,
	Param,
	Post,
	Put,
} from '@nestjs/common'
import {UpsertTagDto} from '../dto/upsert-tag.dto'
import {TagService} from '../services/tag.service'

@Controller('product-tags')
export class ProductTagsController {
	constructor(
		private readonly tagService: TagService,
	) {}

	@Get()
	listTags() {
		return this.tagService.listTags()
	}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	createTag(
		@Body() input: UpsertTagDto,
	) {
		return this.tagService.createTag(input)
	}

	@Put(':id')
	async updateTag(
		@Param('id') id: string,
		@Body() input: UpsertTagDto,
	) {
		const result = await this.tagService.updateTag(id, input)
		if (!result.tag) {
			throw new HttpException('Тег не найден', HttpStatus.NOT_FOUND)
		}

		return result
	}

	@Delete(':id')
	@HttpCode(HttpStatus.NO_CONTENT)
	async deleteTag(
		@Param('id') id: string,
	): Promise<void> {
		const result = await this.tagService.deleteTag(id)
		if (!result.deleted) {
			throw new HttpException('Тег не найден', HttpStatus.NOT_FOUND)
		}
	}
}
