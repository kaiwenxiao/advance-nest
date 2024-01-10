import {ExpressAdapter, NestExpressApplication} from "@nestjs/platform-express";
import {NestFactory} from "@nestjs/core";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter()
  )
  
  AppUtils.killAppWithGrace(app)
}