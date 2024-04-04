import { Test, TestingModule } from '@nestjs/testing';
import { AddressController } from '../address.controller';
import { AddressService } from '../address.service';
import { createAddressMock } from '../__mocks__/create_address.mock';
import { addressMock } from '../__mocks__/address.mock';
import { userEntityMock } from '../../user/__mocks__/user.mock';

describe('AddressController', () => {
  let controller: AddressController;
  let addressService: AddressService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AddressController],
      providers: [
        {
          provide: AddressService,
          useValue: {
            createAddress: jest.fn().mockResolvedValue(addressMock),
            getAddressesByUserId: jest.fn().mockResolvedValue([addressMock]),
          },
        },
      ],
    }).compile();

    controller = module.get<AddressController>(AddressController);
    addressService = module.get<AddressService>(AddressService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(addressService).toBeDefined();
  });

  it('should return address entity in createAddress method', async () => {
    const address = await controller.createAddress(
      createAddressMock,
      userEntityMock.id,
    );

    expect(address).toEqual(addressMock);
  });

  it('should return address entity in getAddressesByUserId method', async () => {
    const address = await controller.getAddressesByUserId(userEntityMock.id);

    expect(address).toEqual([
      {
        complement: addressMock.complement,
        addressNumber: addressMock.addressNumber,
        cep: addressMock.cep,
      },
    ]);
  });
});
