import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from '../payment.service';
import { Repository } from 'typeorm';
import { PaymentEntity } from '../entities/payment.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  createOrderCreditCardMock,
  createOrderPixMock,
} from '../../order/__mocks__/create-order.mock';
import { productMock } from '../../product/__mocks__/product.mock';
import { cartMock } from '../../cart/__mocks__/cart.mock';
import { paymentPixMock } from '../__mocks__/payment-pix.mock';
import { paymentMock } from '../__mocks__/payment.mock';
import { paymentCreditCardMock } from '../__mocks__/payment-credit-card.mock';
import { PaymentPixEntity } from '../entities/payment-pix.entity';
import { PaymentCreditCardEntity } from '../entities/payment-credit-card.entity';
import { BadRequestException } from '@nestjs/common';
import { cartProductMock } from '../../cart-product/__mocks__/cart-product.mock';
import { PaymentType } from '../../payment-status/enums/payment-type.enum';

describe('PaymentService', () => {
  let service: PaymentService;
  let paymentRepository: Repository<PaymentEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(PaymentEntity),
          useValue: {
            find: jest.fn().mockResolvedValue({}),
            save: jest.fn().mockResolvedValue(paymentMock),
          },
        },
        PaymentService,
      ],
    }).compile();

    service = module.get(PaymentService);
    paymentRepository = module.get(getRepositoryToken(PaymentEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(paymentRepository).toBeDefined();
  });

  it('should save payment in DB and check for pix code', async () => {
    const saveMethod = jest.spyOn(paymentRepository, 'save');
    const payment = await service.createPayment(
      createOrderPixMock,
      [productMock],
      cartMock,
    );

    const paymentMethod = saveMethod.mock.calls[0][0] as PaymentPixEntity;

    expect(payment).toEqual(paymentMock);
    expect(paymentMethod.code).toEqual(paymentPixMock.code);
    expect(paymentMethod.datePayment).toEqual(paymentPixMock.datePayment);
  });

  it('should save payment in DB and check for credit card code', async () => {
    const saveMethod = jest.spyOn(paymentRepository, 'save');
    const payment = await service.createPayment(
      createOrderCreditCardMock,
      [productMock],
      cartMock,
    );

    const paymentMethod = saveMethod.mock
      .calls[0][0] as PaymentCreditCardEntity;

    expect(payment).toEqual(paymentMock);
    expect(paymentMethod.amountPayments).toEqual(
      paymentCreditCardMock.amountPayments,
    );
  });

  it('should return exception when data were not send', async () => {
    expect(
      service.createPayment(
        { addressId: createOrderPixMock.addressId },
        [productMock],
        cartMock,
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('should return final price 0 when cart product is undefined', async () => {
    const saveMethod = jest.spyOn(paymentRepository, 'save');
    await service.createPayment(
      createOrderCreditCardMock,
      [productMock],
      cartMock,
    );

    const paymentMethod = saveMethod.mock
      .calls[0][0] as PaymentCreditCardEntity;

    expect(paymentMethod.finalPrice).toEqual(0);
  });

  it('should return final price in createPayment method', async () => {
    const saveMethod = jest.spyOn(paymentRepository, 'save');
    await service.createPayment(createOrderCreditCardMock, [productMock], {
      ...cartMock,
      cartProduct: [cartProductMock],
    });

    const paymentMethod = saveMethod.mock
      .calls[0][0] as PaymentCreditCardEntity;

    expect(paymentMethod.finalPrice).toEqual(1097.6);
  });

  it('should return all data in createPayment method', async () => {
    const saveMethod = jest.spyOn(paymentRepository, 'save');
    await service.createPayment(createOrderCreditCardMock, [productMock], {
      ...cartMock,
      cartProduct: [cartProductMock],
    });

    const paymentMethod = saveMethod.mock
      .calls[0][0] as PaymentCreditCardEntity;

    const paymentCreditCard: PaymentCreditCardEntity =
      new PaymentCreditCardEntity(
        PaymentType.Done,
        1097.6,
        0,
        1097.6,
        createOrderCreditCardMock,
      );

    expect(paymentMethod).toEqual(paymentCreditCard);
  });
});
