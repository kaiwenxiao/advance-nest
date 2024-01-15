import {IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength} from 'class-validator';
import { IsPassword } from '@common/validators/is-password.validator';
import { IsUsername } from '@common/validators/is-username.validator';

export class CreateUserDto {
	@IsNotEmpty()
	@IsString()
	@MinLength(5)
	@MaxLength(255)
	fullName: string

	@IsOptional()
	@IsString()
	@MinLength(5)
	@MaxLength(255)
	bio: string

	@IsOptional()
	@IsString()
	@MinLength(5)
	@MaxLength(255)
	website: string

	@IsNotEmpty()
	@IsUsername()
	username: string

	@IsNotEmpty()
	@IsEmail()
	email: string;

	@IsPassword()
	password: string
}

