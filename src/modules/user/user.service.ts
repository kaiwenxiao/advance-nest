import { EntityRepository } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { User } from '@entities';
import { wrap } from '@mikro-orm/core';
import { paginate, Pagination } from '@lib/pagination';
import {omit} from "helper-fns";
import {CreateUserDto} from "@modules/user/dto/create-user.dto";
import {EditUserDto} from "@modules/user/dto/update-user.dto";

export interface UserFindOne {
  id?: number;
  email?: string;
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
  ) {}

  async getMany(limit: number, page: number): Promise<Pagination<User>> {
    const qb = this.userRepository.createQueryBuilder('user');

    const offset = (page - 1) * limit;

    qb.select('*')
      .limit(limit)
      .offset(offset)
      .orderBy({ createdAt: 'desc' });

    const users = await qb.getResult();

    return paginate<User>(users, {
      limit,
      page,
      route: 'http:localhost:8000/',
    });
  }

  async getOneUser(idx: string) {
    const user = await this.userRepository.findOne({
      idx,
      isObsolete: false,
    });

    if (!user)
      throw new NotFoundException('User does not exists or unauthorized');

    return user;
  }

  async createOne(dto: CreateUserDto) {
    const emailUserExist = await this.userRepository.findOne({
      email: dto.email,
      isObsolete: false,
    });

    if (emailUserExist)
      throw new BadRequestException(
        'Account already registered with email',
      );

    const usernameExist = await this.userRepository.findOne({
      username: dto.username,
      isObsolete: false,
    });

    if (usernameExist)
      throw new BadRequestException('Username is already taken');

    // @ts-ignore
    // TODO??
    const newUser = this.userRepository.create(dto);

    await this.userRepository.persistAndFlush(newUser);

    return omit(newUser, ['password']);
  }

  async editOne(idx: string, dto: EditUserDto) {
    const user = await this.getOneUser(idx);

    wrap(user).assign(dto);
    await this.userRepository.flush();

    return user;
  }

  async deleteUser(idx: string) {
    const user = await this.getOneUser(idx);

    return this.userRepository.remove(user);
  }

  async findUser(data: UserFindOne) {
    return await this.userRepository
      .createQueryBuilder()
      .where(data)
      .getSingleResult();
  }
}
