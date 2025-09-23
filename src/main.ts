import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Cors
  app.enableCors({
        origin: true,
        credentials: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    });
  
  // Cache
  app.use((req, res, next) => {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.setHeader('Surrogate-Control', 'no-store');
      next();
  });

  // Middleware for cookies
  app.use(cookieParser());

  // app.use(Credential)

  // Prefix
  app.setGlobalPrefix('api6');
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
