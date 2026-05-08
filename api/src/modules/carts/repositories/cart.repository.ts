import {CreateCartDto} from '../dto/create-cart.dto'
import {Cart} from '../types/cart.types'

abstract class CartRepository {
	abstract getCartById(id: string): Promise<Cart | null>
	abstract createCart(input: CreateCartDto): Promise<Cart>
	abstract updateCart(cart: Cart): Promise<Cart>
	abstract deleteCart(id: string): Promise<boolean>
}

export {CartRepository}
