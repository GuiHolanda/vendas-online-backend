import { ReturnCityDTO } from '../../city/dtos/returnCity.dto';
import { AddressEntity } from '../entities/address.entity';

export class ReturnAddressDto {
  id: number;
  complement: string;
  addressNumber: number;
  cep: string;
  cityId: number;
  city?: ReturnCityDTO;

  constructor(address: AddressEntity) {
    this.id = address.id;
    this.complement = address.complement;
    this.addressNumber = address.addressNumber;
    this.cep = address.cep;
    this.city = address.city ? new ReturnCityDTO(address.city) : undefined;
  }
}
