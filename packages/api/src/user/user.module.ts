import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserEntity } from './entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from "dotenv";
import { JwtStrategy } from './strategy/passport-jwt.strategy';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      //jle defini le .env
      secret: process.env.SECRET,
      signOptions: { expiresIn: 3600 }
    })
  ],
  controllers: [UserController],
  providers: [UserService, JwtStrategy]
})
export class UserModule { };
