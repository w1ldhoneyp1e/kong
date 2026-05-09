import {Injectable} from '@nestjs/common'
import {mkdir, readFile, writeFile} from 'node:fs/promises'
import path from 'node:path'
import {UpdateContentPageDto} from '../dto/update-content-page.dto'
import {ContentPageRepository} from './content-page.repository'
import {ContentPage} from '../types/content-page.types'

function resolveApiDataPath(fileName: string): string {
	const cwd = process.cwd()
	const apiRoot = path.basename(cwd) === 'api'
		? cwd
		: path.resolve(cwd, 'api')
	return path.resolve(apiRoot, 'data', fileName)
}

const PAGES_FILE_PATH = resolveApiDataPath('content-pages.json')

type PagesFile = {
	pages: ContentPage[],
}

@Injectable()
export class FileContentPageRepository extends ContentPageRepository {
	private static writeQueue = Promise.resolve()

	async listPages(): Promise<ContentPage[]> {
		const file = await this.readPagesFile()
		return [...file.pages].sort((a, b) => a.slug.localeCompare(b.slug, 'ru'))
	}

	async getPageBySlug(slug: string): Promise<ContentPage | null> {
		const normalized = slug.trim().toLowerCase()
		const file = await this.readPagesFile()
		return file.pages.find(page => page.slug === normalized) ?? null
	}

	async updatePage(slug: string, input: UpdateContentPageDto): Promise<ContentPage | null> {
		const normalized = slug.trim().toLowerCase()
		return this.mutateFile(file => {
			const index = file.pages.findIndex(page => page.slug === normalized)
			if (index < 0) {
				return {
					nextFile: file,
					result: null,
				}
			}

			const existing = file.pages[index]
			if (!existing) {
				return {
					nextFile: file,
					result: null,
				}
			}

			const updated: ContentPage = {
				...existing,
				title: input.title?.trim() || existing.title,
				description: input.description === undefined
					? existing.description
					: (input.description?.trim() || null),
				body: input.body === undefined
					? existing.body
					: input.body.trim(),
				updated_at: new Date().toISOString(),
			}
			file.pages[index] = updated
			return {
				nextFile: file,
				result: updated,
			}
		})
	}

	private async readPagesFile(): Promise<PagesFile> {
		try {
			const content = await readFile(PAGES_FILE_PATH, 'utf8')
			const parsed = JSON.parse(content) as PagesFile
			if (Array.isArray(parsed.pages)) {
				return parsed
			}
		}
		catch {}

		return {
			pages: this.seedPages(),
		}
	}

	private async writePagesFile(file: PagesFile): Promise<void> {
		await mkdir(path.dirname(PAGES_FILE_PATH), {recursive: true})
		await writeFile(PAGES_FILE_PATH, `${JSON.stringify(file, null, 2)}\n`, 'utf8')
	}

	private async mutateFile<T>(mutator: (file: PagesFile) => {
		nextFile: PagesFile,
		result: T,
	}): Promise<T> {
		const operation = FileContentPageRepository.writeQueue.then(async () => {
			const file = await this.readPagesFile()
			const {
				nextFile,
				result,
			} = mutator(file)
			await this.writePagesFile(nextFile)
			return result
		})
		FileContentPageRepository.writeQueue = operation.then(() => undefined, () => undefined)
		return operation
	}

	private seedPages(): ContentPage[] {
		const now = new Date().toISOString()
		return [
			{
				id: 'page_about',
				slug: 'about',
				title: 'О нас',
				description: 'О компании Kong Store и нашем подходе к покупательскому опыту.',
				body: 'Kong Store делает удобный и понятный онлайн-шопинг: от быстрого выбора товара до прозрачного оформления заказа.\n\nМы развиваем витрину, чтобы покупатель мог легко находить товары, сравнивать варианты и получать актуальную информацию о заказе.',
				updated_at: now,
			},
			{
				id: 'page_contacts',
				slug: 'contacts',
				title: 'Контакты',
				description: 'Контакты Kong Store: телефон, email и адрес.',
				body: 'Телефон: +7 (999) 000-00-00\nEmail: support@kong.store\nАдрес: Москва, Примерная улица, 10',
				updated_at: now,
			},
		]
	}
}
