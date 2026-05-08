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
import {UpsertCategoryDto} from '../dto/upsert-category.dto'
import {CategoryService} from '../services/category.service'

@Controller('categories')
export class CategoriesController {
	constructor(
		private readonly categoryService: CategoryService,
	) {}

	@Get()
	listCategories() {
		return this.categoryService.listCategories()
	}

	@Get(':id')
	async getCategory(
		@Param('id') id: string,
	) {
		const result = await this.categoryService.getCategory(id)
		if (!result.category) {
			throw new HttpException('Категория не найдена', HttpStatus.NOT_FOUND)
		}

		return result
	}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	createCategory(
		@Body() input: UpsertCategoryDto,
	) {
		return this.categoryService.createCategory(input)
	}

	@Put(':id')
	async updateCategory(
		@Param('id') id: string,
		@Body() input: UpsertCategoryDto,
	) {
		const result = await this.categoryService.updateCategory(id, input)
		if (!result.category) {
			throw new HttpException('Категория не найдена', HttpStatus.NOT_FOUND)
		}

		return result
	}

	@Delete(':id')
	@HttpCode(HttpStatus.NO_CONTENT)
	async deleteCategory(
		@Param('id') id: string,
	): Promise<void> {
		const result = await this.categoryService.deleteCategory(id)
		if (result.hasChildren) {
			throw new HttpException(
				'Нельзя удалить категорию, у которой есть дочерние категории',
				HttpStatus.CONFLICT,
			)
		}
		if (!result.deleted) {
			throw new HttpException('Категория не найдена', HttpStatus.NOT_FOUND)
		}
	}
}
