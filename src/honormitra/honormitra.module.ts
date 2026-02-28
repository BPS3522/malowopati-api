import { Module } from '@nestjs/common';
import { HonormitraService } from './honormitra.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/auth/auth.guard';
import { HonormitraController } from './honormitra.controller';

@Module({
  providers: [
    HonormitraService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  controllers: [HonormitraController],
  imports: [HonormitraModule],
})
export class HonormitraModule {}
