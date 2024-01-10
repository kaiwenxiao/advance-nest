import {Module} from "@nestjs/common";
import { ConfigModule as NestJsConfigModule, ConfigService } from '@nestjs/config';
import {validationSchema} from "@lib/config/app.config";
import {app} from "firebase-admin";

@Module({
  imports: [
	  NestJsConfigModule.forRoot({
      envFilePath: [`${process.cwd()}/env/.env.${process.env.NODE_ENV}`],
      load: [
        app
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