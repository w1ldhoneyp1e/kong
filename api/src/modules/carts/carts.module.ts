import {Module} from '@nestjs/common'
import {CatalogModule} from '../catalog/catalog.module'
import {CustomersModule} from '../customers/customers.module'
import {OrdersModule} from '../orders/orders.module'
import {StoreCartsController} from './controllers/store-carts.controller'
import {CartsService} from './carts.service'
import {CartRepository} from './repositories/cart.repository'
import {FileCartRepository} from './repositories/file-cart.repository'

@Module({
	imports: [CatalogModule, OrdersModule, CustomersModule],
	controllers: [StoreCartsController],
	providers: [
		CartsService,
		{
			provide: CartRepository,
			useClass: FileCartRepository,
		},
	],
})
export class CartsModule {}
