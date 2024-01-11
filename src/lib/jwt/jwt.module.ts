import {Global, Module} from "@nestjs/common";
import {JwtModule as NestJwtModule} from '@nestjs/jwt'
import {ConfigModule, ConfigService} from "@nestjs/config";

@Global()
@Module({
  exports: [NestJwtModule],
  imports: [
    NestJwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: {
          expiresIn: configService.get<number>('jwt.accessExpiry')
        }
      }),
      inject: [ConfigService]
    })
  ]
})
export class JwtModule {}