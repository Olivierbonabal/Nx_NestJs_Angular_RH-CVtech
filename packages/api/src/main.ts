import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Request, Response, NextFunction } from 'express';
import { DurationInterceptor } from './interceptors/duration.interceptor';
import * as dotenv from "dotenv";
import { ConfigService } from '@nestjs/config';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  app.use(
    (req: Request, res: Response, next: NextFunction) => {
      console.log("middleware from app.use");
      next();
    }
  );

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    //securité ==> j'affiche que mon dto
    whitelist: true,
    forbidNonWhitelisted: true
  }));

  app.useGlobalInterceptors(new DurationInterceptor);

  await app.listen(configService.get('APP_PORT'));
  console.log("App listening on port " + configService.get('APP_PORT'))
}
bootstrap();
