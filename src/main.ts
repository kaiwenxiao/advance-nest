import {ExpressAdapter, NestExpressApplication} from "@nestjs/platform-express";
import {NestFactory} from "@nestjs/core";
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import compression from 'compression';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter()
  )
  
	const configService = app.get(ConfigService)

	// ==================================================
	// configureExpressSettings
	// ==================================================

	app.enableCors()
	app.use(helmet())
	app.use(compression())

	// ==================================================
	// configureNestGlobals
	// ==================================================

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			transform: true
		})
	).setGlobalPrefix('v1')


	const port = configService.get<number>('app.port', 3000)

	await app.listen(port)

	console.info('Bootstrap', `Server running on 🚀 ${await app.getUrl()}`)
}

(async () => await bootstrap())()