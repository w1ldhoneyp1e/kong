import {Injectable} from '@nestjs/common'
import {ConfigService} from '@nestjs/config'

@Injectable()
export class EnvironmentService {
	constructor(
		private readonly configService: ConfigService,
	) {}

	get nodeEnv(): string {
		return this.configService.get<string>('NODE_ENV') ?? 'development'
	}

	get port(): number {
		const value = this.configService.get<string>('PORT') ?? '9001'
		return Number(value)
	}

	get appUrl(): string {
		return this.configService.get<string>('APP_URL') ?? 'http://localhost:3000'
	}

	get apiUrl(): string {
		return this.configService.get<string>('API_URL') ?? 'http://localhost:9001'
	}

	get databaseUrl(): string {
		const value = this.configService.get<string>('DATABASE_URL')
		if (!value) {
			throw new Error('DATABASE_URL is not configured')
		}

		return value
	}

	get jwtSecret(): string {
		const value = this.configService.get<string>('JWT_SECRET')
		if (!value) {
			throw new Error('JWT_SECRET is not configured')
		}

		return value
	}

	get staffJwtSecret(): string {
		const value = this.configService.get<string>('STAFF_JWT_SECRET')
		if (!value) {
			throw new Error('STAFF_JWT_SECRET is not configured')
		}

		return value
	}
}
