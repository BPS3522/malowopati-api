import { Module } from '@nestjs/common';
import { KegiatanService } from './kegiatan.service';
import { KegiatanController } from './kegiatan.controller';
import { KegiatanmitraModule } from 'src/kegiatanmitra/kegiatanmitra.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/auth/auth.guard';
import { FiltersModule } from 'src/filters/filters.module';

@Module({
  providers: [
    KegiatanService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  controllers: [KegiatanController],
  imports: [KegiatanmitraModule, FiltersModule],
})
export class KegiatanModule {}
