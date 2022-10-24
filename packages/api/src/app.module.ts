import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodoModule } from './todo/todo.module';
import { FirstMiddleware } from './middlewares/first.middleware';
import { logger } from './middlewares/logger.middleware';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CvModule } from './cvBack/cv.module';
import * as dotenv from 'dotenv';
import { UserModule } from './user/user.module';
import { CvEntity } from './cvBack/entities/cv.entity';
import { UserEntity } from './user/entities/user.entity';

dotenv.config();

@Module({
  imports: [
    TodoModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      //pr search en global ==> mais à éviter!!!(apres test...)
      // entities: ["dist/**/*.entity{.ts,.js}"],
      entities: [CvEntity, UserEntity],
      synchronize: true,
    }),
    CvModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [AppService]
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(FirstMiddleware).forRoutes('hello',
      { path: 'todo', method: RequestMethod.GET },
      { path: 'todo*', method: RequestMethod.DELETE }
    )
      .apply(logger).forRoutes('')
  }
}
