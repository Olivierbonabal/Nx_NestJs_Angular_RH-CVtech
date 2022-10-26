import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { CvController } from './cv.controller';
import { CvService } from './cv.service';
import { CvEntity } from './entities/cv.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CvEntity]),
   UserModule
  ],
controllers: [CvController],
  providers: [CvService]
})

export class CvModule {};
