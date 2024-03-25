import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartProductEntity } from './entities/cart-product.entity';
import { DeleteResult, Repository } from 'typeorm';
import { InsertCartDTO } from 'src/cart/dtos/insert-cart.dto';
import { CartEntity } from 'src/cart/entities/cart.entity';
import { ProductService } from 'src/product/product.service';
import { UpdateCartDTO } from 'src/cart/dtos/update-cart.dto';

@Injectable()
export class CartProductService {
  constructor(
    @InjectRepository(CartProductEntity)
    private readonly cartProductRepository: Repository<CartProductEntity>,
    private readonly productService: ProductService,
  ) {}

  async verifyProductInCart(
    productId: number,
    cartId: number,
  ): Promise<CartProductEntity> {
    const cartProduct = await this.cartProductRepository.findOne({
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
    await this.productService.getProductById(insertCart.productId);
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

  async updateProductInCart(
    updateCartDTO: UpdateCartDTO,
    cart: CartEntity,
  ): Promise<CartProductEntity> {
    await this.productService.getProductById(updateCartDTO.productId);

    const cartProduct = await this.verifyProductInCart(
      updateCartDTO.productId,
      cart.id,
    );

    return this.cartProductRepository.save({
      ...cartProduct,
      amount: updateCartDTO.amount,
    });
  }

  async deleteProductCart(
    productId: number,
    cartId: number,
  ): Promise<DeleteResult> {
    return this.cartProductRepository.delete({ productId, cartId });
  }
}
