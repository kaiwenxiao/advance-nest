import { ConfigModule } from '@lib/config/configs/config.module';
import { LoggingInterceptor } from '@common/interceptors/logger.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { UserModule } from '@modules/user/user.module';

@Module({
	imports: [
		ConfigModule,
		UserModule
	],
	providers: [
		{
			useClass: LoggingInterceptor,
			provide: APP_INTERCEPTOR
		}
	]
})
export class AppModule {}