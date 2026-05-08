import {Module} from '@nestjs/common'
import {OrdersController} from './orders.controller'
import {OrdersService} from './orders.service'
import {OrderRepository} from './repositories/order.repository'
import {FileOrderRepository} from './repositories/file-order.repository'
import {StaffModule} from '../staff/staff.module'

@Module({
	imports: [StaffModule],
	controllers: [OrdersController],
	providers: [
		OrdersService,
		{
			provide: OrderRepository,
			useClass: FileOrderRepository,
		},
	],
	exports: [OrdersService, OrderRepository],
})
export class OrdersModule {}
