import {UpdateContentPageDto} from '../dto/update-content-page.dto'
import {ContentPage} from '../types/content-page.types'

abstract class ContentPageRepository {
	abstract listPages(): Promise<ContentPage[]>
	abstract getPageBySlug(slug: string): Promise<ContentPage | null>
	abstract updatePage(slug: string, input: UpdateContentPageDto): Promise<ContentPage | null>
}

export {ContentPageRepository}
