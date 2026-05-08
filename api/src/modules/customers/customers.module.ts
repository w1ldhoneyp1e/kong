import {Module} from '@nestjs/common'
import {OrdersModule} from '../orders/orders.module'
import {CustomersController} from './customers.controller'
import {CustomersService} from './customers.service'
import {CustomerRepository} from './repositories/customer.repository'
import {FileCustomerRepository} from './repositories/file-customer.repository'
import {StaffModule} from '../staff/staff.module'

@Module({
	imports: [StaffModule, OrdersModule],
	controllers: [CustomersController],
	providers: [
		CustomersService,
		{
			provide: CustomerRepository,
			useClass: FileCustomerRepository,
		},
	],
})
export class CustomersModule {}
