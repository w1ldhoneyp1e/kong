import {
	Body,
	Controller,
	Get,
	Headers,
	Put,
	UnauthorizedException,
} from '@nestjs/common'
import {UpdateStoreDto} from './dto/update-store.dto'
import {StoreService} from './store.service'

@Controller('store')
export class StoreController {
	constructor(
		private readonly storeService: StoreService,
	) {}

	@Get()
	getStore() {
		return this.storeService.getStore()
	}

	@Put()
	updateStore(
		@Headers('authorization') authorization: string | undefined,
		@Body() input: UpdateStoreDto,
	) {
		return this.storeService.updateStore(this.extractBearerToken(authorization), input)
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
