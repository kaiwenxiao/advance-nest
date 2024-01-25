import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
	Body,
	Controller, Delete,
	Get,
	Param, ParseUUIDPipe,
	Post,
	Put,
	Query,
	UploadedFile,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '@common/guards/jwt.guard';
import { PostService } from '@modules/post/post.service';
import { GetPaginationQuery } from '@common/classes/pagination';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageMulterOption } from '@common/misc/misc';
import { CreatePostDto } from '@modules/post/dto/create-post.dto';
import { LoggedInUser } from '@common/decorators/user.decorator';
import { User } from '@entities';
import { IResponse } from '@common/interfaces/response.interface';
import {Post as Posts} from '@entities'
import { CreateCommentDto, EditCommentDto } from '@modules/post/dto/create-comment.dto';
import { EditPostDto } from '@modules/post/dto/update-post.dto';

@ApiTags('Posts routes')
@Controller('post')
@UseGuards(JwtAuthGuard)
export class PostController {
	constructor(private readonly postService: PostService) {
	}

	@ApiOperation({ summary: 'Get all user posts' })
	@Get()
	async getMany(@Query() params: GetPaginationQuery) {
		const data = await this.postService.getManyPost(
			params.limit,
			params.page
		)

		return { message: 'Success', data }
	}

	@ApiOperation({ summary: 'Create a post' })
	@Post()
	@UseInterceptors(FileInterceptor('file', ImageMulterOption))
	async createPost(
		@Body() dto: CreatePostDto,
		@UploadedFile() image: Express.Multer.File,
		@LoggedInUser() user: User
	): Promise<IResponse<Posts>> {
		const data = await this.postService.createPost(
			{
				...dto,
				file: image.filename
			},
			user
		)

		return { message: 'Post created', data }
	}

	@ApiOperation({ summary: 'Get one user post' })
	@Get(':idx')
	async getOne(
		@Param('idx', ParseUUIDPipe) idx: string,
	): Promise<IResponse<Posts>> {
		const data = await this.postService.getOnePost(idx);

		return { message: 'success', data };
	}

	@ApiOperation({ summary: 'Edit user post' })
	@Put(':idx')
	async editOne(
		@Param('idx', ParseUUIDPipe) idx: string,
		@Body() dto: EditPostDto,
	): Promise<IResponse<Posts>> {
		const data = await this.postService.editPost(idx, dto)

		return { message: 'Post edited', data }
	}

	@ApiOperation({ summary: 'Create comment' })
	@Post(':idx/comment')
	async createComment(
		@Param('idx', ParseUUIDPipe) idx: string,
		@Body() createComment: CreateCommentDto,
		@LoggedInUser() user: User,
	): Promise<IResponse<any>> {
		const data = await this.postService.createComment(
			idx,
			createComment,
			user,
		);

		return { message: 'Comment created', data };
	}

	@ApiOperation({ summary: 'Like post' })
	@Post(':idx/favourite')
	async favouritePost(
		// TODO @Param pipe?
		@Param('idx', ParseUUIDPipe) idx: string,
		@LoggedInUser() user: User
	): Promise<IResponse<any>> {
		const data = await this.postService.likePost(idx, user)

		return { message: 'Post liked', data }
	}


	@ApiOperation({ summary: 'Unlike post' })
	@Delete(':idx/favourite/')
	async unFavouritePost(
		@Param('idx', ParseUUIDPipe) idx: string,
		@LoggedInUser() user: User,
	): Promise<IResponse<any>> {
		const data = await this.postService.unLikePost(idx, user);

		return { message: 'Post unliked', data };
	}

	@ApiOperation({ summary: 'Edit comment' })
	@Put(':idx/comment/:commentIdx')
	async editComment(
		@Param('idx', ParseUUIDPipe) idx: string,
		@Param('commentIdx', ParseUUIDPipe) commentIdx: string,
		@Body() dto: EditCommentDto
	) {
		return this.postService.editComment(idx, commentIdx, dto)
	}

	@ApiOperation({ summary: 'Delete comment' })
	@Delete(':idx/comment/:commentIdx')
	async deleteComment(
		@Param('idx', ParseUUIDPipe) idx: string,
		@Param('commentIdx', ParseUUIDPipe) commentIdx: string,
	) {
		return this.postService.deleteComment(idx, commentIdx);
	}

	@ApiOperation({ summary: 'Delete user post' })
	@Delete(':idx')
	async deleteOne(
		@Param('idx', ParseUUIDPipe) idx: string,
		@LoggedInUser() user: User,
	): Promise<IResponse<Posts>> {
		const data = await this.postService.deletePost(idx, user);

		return { message: 'Post deleted', data };
	}
}