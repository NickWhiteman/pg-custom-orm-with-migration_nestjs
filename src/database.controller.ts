import { Controller, Get } from '@nestjs/common';
import { WalletRepository } from './repositories/wallet/wallet.repository';
import { WalletEntity } from './entitys/wallet.entity';

@Controller('database')
export class DatabaseController {
  constructor(private wallet: WalletRepository) {}

  @Get()
  public async getRequest() {
    console.log('getRequest');
    const result: WalletEntity | WalletEntity[] = await this.wallet.read(1);
    console.log(result);
  }
}
