import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { OrmModule } from '@lib/orm/orm.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
	// if you want to use the specific Repository of ORM in service,
	// you need import OrmModule here, as Dependency Injection
	imports: [OrmModule],
  exports: [UserService]
})
export class UserModule {}
``