import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartProductEntity } from './entities/cart-product.entity';
import { Repository } from 'typeorm';
import { InsertCartDTO } from 'src/cart/dtos/insert-cart.dto';
import { CartEntity } from 'src/cart/entities/cart.entity';

@Injectable()
export class CartProductService {
  constructor(
    @InjectRepository(CartProductEntity)
    private readonly cartProductRepository: Repository<CartProductEntity>,
  ) {}

  async verifyProductInCart(
    productId: number,
    cartId: number,
  ): Promise<CartProductEntity> {
    const cartProduct = this.cartProductRepository.findOne({
      where: {
        productId,
        cartId,
      },
    });

    if (!cartProduct) {
      throw new NotFoundException(
        `product with id: ${productId} were not found in cart`,
      );
    }

    return cartProduct;
  }

  async createProductInCart(
    insertCart: InsertCartDTO,
    cartId: number,
  ): Promise<CartProductEntity> {
    return this.cartProductRepository.save({
      amount: insertCart.amount,
      productId: insertCart.productId,
      cartId,
    });
  }

  async insertProductInCart(
    insertCart: InsertCartDTO,
    cart: CartEntity,
  ): Promise<CartProductEntity> {
    try {
      const cartProduct = await this.verifyProductInCart(
        insertCart.productId,
        cart.id,
      );

      return this.cartProductRepository.save({
        ...cartProduct,
        amount: cartProduct.amount + insertCart.amount,
      });
    } catch (error) {
      return this.createProductInCart(insertCart, cart.id);
    }
  }
}
