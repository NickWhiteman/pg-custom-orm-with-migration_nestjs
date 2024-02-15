import { Injectable } from '@nestjs/common';
import { WalletRepository } from './repositories/wallet/wallet.repository';

@Injectable()
export class DatabaseService {
  constructor(private wallet: WalletRepository) {}
}
