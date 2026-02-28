import { Module } from '@nestjs/common';
import { KeuanganService } from './keuangan.service';
import { KeuanganController } from './keuangan.controller';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';

@Module({
  providers: [
    KeuanganService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  controllers: [KeuanganController],
})
export class KeuanganModule {}
