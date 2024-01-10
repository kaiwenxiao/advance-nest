import {Module} from "@nestjs/common";
import {ConfigModule} from "@nestjs/config";
import Joi from "joi";
import {validationSchema} from "@lib/config/app.config";
import {app} from "firebase-admin";

@Module({
  imports: [
    ConfigModule.forRoot({
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
})
export class NestConfigModule {}