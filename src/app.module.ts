import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { MitraModule } from './mitra/mitra.module';
import { KegiatanmitraModule } from './kegiatanmitra/kegiatanmitra.module';
import { BatashonorModule } from './batashonor/batashonor.module';
import { FilesModule } from './files/files.module';
import { HonormitraService } from './honormitra/honormitra.service';
import { HonormitraController } from './honormitra/honormitra.controller';
import { HonormitraModule } from './honormitra/honormitra.module';
import { KegiatanModule } from './kegiatan/kegiatan.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [PrismaModule, MitraModule, KegiatanmitraModule, BatashonorModule, FilesModule, HonormitraModule, KegiatanModule, AuthModule, UsersModule],
  controllers: [AppController, HonormitraController],
  providers: [AppService, HonormitraService],
})
export class AppModule {}
