import {Module} from '@nestjs/common'
import {OrdersModule} from '../orders/orders.module'
import {CustomerAuthController} from './controllers/customer-auth.controller'
import {CustomerMeController} from './controllers/customer-me.controller'
import {StoreOrdersController} from './controllers/store-orders.controller'
import {CustomerAuthService} from './customer-auth.service'
import {CustomersController} from './customers.controller'
import {CustomersService} from './customers.service'
import {CustomerRepository} from './repositories/customer.repository'
import {FileCustomerRepository} from './repositories/file-customer.repository'
import {StaffModule} from '../staff/staff.module'

@Module({
	imports: [StaffModule, OrdersModule],
	controllers: [
		CustomersController,
		CustomerAuthController,
		CustomerMeController,
		StoreOrdersController,
	],
	providers: [
		CustomerAuthService,
		CustomersService,
		{
			provide: CustomerRepository,
			useClass: FileCustomerRepository,
		},
	],
	exports: [CustomerAuthService, CustomerRepository],
})
export class CustomersModule {}
