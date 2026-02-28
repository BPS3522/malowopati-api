import { Module } from '@nestjs/common';
import { KegiatanmitraService } from './kegiatanmitra.service';
import { KegiatanmitraController } from './kegiatanmitra.controller';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/auth/auth.guard';
import { FiltersModule } from 'src/filters/filters.module';

@Module({
  providers: [
    KegiatanmitraService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  controllers: [KegiatanmitraController],
  exports: [KegiatanmitraService],
  imports: [FiltersModule],
})
export class KegiatanmitraModule {}
