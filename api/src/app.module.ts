import {Module} from '@nestjs/common'
import {ConfigModule} from '@nestjs/config'
import {AuthModule} from './modules/auth/auth.module'
import {CatalogModule} from './modules/catalog/catalog.module'
import {EnvironmentModule} from './modules/config/environment.module'
import {HealthModule} from './modules/health/health.module'
import {PrismaModule} from './modules/prisma/prisma.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: ['.env.local', '.env'],
		}),
		EnvironmentModule,
		PrismaModule,
		HealthModule,
		AuthModule,
		CatalogModule,
	],
})
export class AppModule {}
