import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { User } from './user.entity';
import { JwtStrategy } from './jwt.strategy';


@Module({
  imports: [
    JwtModule.register({
      secret: "bfour4",
      signOptions: {
        expiresIn: 3600
      }
    }),
    PassportModule.register({
      defaultStrategy: "jwt"
    }),
    TypeOrmModule.forFeature([User])
  ],
  providers: [
    AuthService,
    JwtStrategy
  ],
  exports: [
    JwtStrategy,
    PassportModule
  ],
  controllers: [AuthController]
})
export class AuthModule {}
