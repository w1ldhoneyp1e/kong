import {Module} from '@nestjs/common'
import {ConfigModule} from '@nestjs/config'
import {CatalogModule} from './modules/catalog/catalog.module'
import {CartsModule} from './modules/carts/carts.module'
import {EnvironmentModule} from './modules/config/environment.module'
import {CustomersModule} from './modules/customers/customers.module'
import {HealthModule} from './modules/health/health.module'
import {OrdersModule} from './modules/orders/orders.module'
import {PrismaModule} from './modules/prisma/prisma.module'
import {StaffModule} from './modules/staff/staff.module'
import {StoreModule} from './modules/store/store.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: ['.env.local', '.env'],
		}),
		EnvironmentModule,
		PrismaModule,
		HealthModule,
		StaffModule,
		StoreModule,
		OrdersModule,
		CartsModule,
		CustomersModule,
		CatalogModule,
	],
})
export class AppModule {}
