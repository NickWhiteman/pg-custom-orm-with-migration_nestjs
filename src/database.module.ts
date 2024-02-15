import { Global, Module } from '@nestjs/common';

import { DatabaseController } from './database.controller';
import { DatabaseService } from './database.service';
import { WalletRepository } from './repositories/wallet/wallet.repository';

@Global()
@Module({
  controllers: [DatabaseController],
  providers: [DatabaseService, WalletRepository],
})
export class PgOrmModule {}
