import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartEntity } from './entities/cart.entity';
import { DeleteResult, Repository } from 'typeorm';
import { InsertCartDTO } from './dtos/insert-cart.dto';
import { CartProductService } from '../cart-product/cart-product.service';
import { LINES_AFFECTED } from '../constants';
import { UpdateCartDTO } from './dtos/update-cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartEntity)
    private readonly cartRepository: Repository<CartEntity>,
    private readonly cartProductService: CartProductService,
  ) {}

  async getCartByUserId(
    userId: number,
    isWithRelations: boolean = false,
  ): Promise<CartEntity> {
    const relations = isWithRelations
      ? { cartProduct: { product: true } }
      : undefined;

    const cart = await this.cartRepository.findOne({
      where: { userId, active: true },
      relations,
    });

    if (!cart) {
      throw new NotFoundException(
        `No active cart were found for the user with the id: ${userId}`,
      );
    }

    return cart;
  }

  async createCart(userId: number): Promise<CartEntity> {
    return this.cartRepository.save({
      active: true,
      userId,
    });
  }

  async insertProductInCart(
    insertCart: InsertCartDTO,
    userId: number,
  ): Promise<CartEntity> {
    const cart = await this.getCartByUserId(userId).catch(async () =>
      this.createCart(userId),
    );

    await this.cartProductService.insertProductInCart(insertCart, cart);

    return cart;
  }

  async updateProductInCart(
    updateCartDTO: UpdateCartDTO,
    userId: number,
  ): Promise<CartEntity> {
    const cart = await this.getCartByUserId(userId).catch(async () =>
      this.createCart(userId),
    );

    await this.cartProductService.updateProductInCart(updateCartDTO, cart);

    return cart;
  }

  async clearCart(userId: number): Promise<DeleteResult> {
    const cart = await this.getCartByUserId(userId);

    this.cartRepository.save({
      ...cart,
      active: false,
    });

    return {
      raw: [],
      affected: LINES_AFFECTED,
    };
  }

  async deleteProductCart(
    productId: number,
    userId: number,
  ): Promise<DeleteResult> {
    const cart = await this.getCartByUserId(userId);

    return this.cartProductService.deleteProductCart(productId, cart.id);
  }
}
