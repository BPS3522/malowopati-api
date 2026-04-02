import { Module } from '@nestjs/common';
import { EvaluasiService } from './evaluasi.service';
import { EvaluasiController } from './evaluasi.controller';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/auth/auth.guard';

@Module({
  imports: [EvaluasiModule],
  controllers: [EvaluasiController],
  providers: [EvaluasiService,
    {
        provide: APP_GUARD,
        useClass: AuthGuard,
      },],
})
export class EvaluasiModule {}