import { Module } from '@nestjs/common';
import { BatashonorController } from './batashonor.controller';
import { BatashonorService } from './batashonor.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/auth/auth.guard';

@Module({
  controllers: [BatashonorController],
  providers: [
    BatashonorService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class BatashonorModule {}
