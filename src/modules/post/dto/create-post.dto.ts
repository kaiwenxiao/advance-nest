import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreatePostDto {
	@IsOptional()
	@IsString()
	@MinLength(5)
	@MaxLength(255)
	caption: string

	file: string
}
