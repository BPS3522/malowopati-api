import { Module } from '@nestjs/common';
import { KegiatanmitraService } from './kegiatanmitra.service';
import { KegiatanmitraController } from './kegiatanmitra.controller';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/auth/auth.guard';

@Module({
  providers: [KegiatanmitraService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  controllers: [KegiatanmitraController],
  exports: [KegiatanmitraService],
})
export class KegiatanmitraModule {}
