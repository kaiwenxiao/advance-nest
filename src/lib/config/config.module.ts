import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestJsConfigModule, ConfigService } from '@nestjs/config';
import { validationSchema } from './validate.config';
import { app, database, jwt } from './configs';

@Global()
@Module({
  imports: [
	  NestJsConfigModule.forRoot({
      envFilePath: ['env/.env.dev'],
      load: [
        app, database, jwt
      ],
      cache: true,
      isGlobal: true,
      expandVariables: true,
      validationSchema: validationSchema
    })
  ],
	providers: [ConfigService],
	exports: [ConfigService]
})
export class ConfigModule {}