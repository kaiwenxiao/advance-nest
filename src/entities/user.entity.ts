import {
  BeforeCreate,
  BeforeUpdate,
  Collection,
  Entity,
  EntityDTO,
  ManyToMany,
  OneToMany,
  Property,
  wrap
} from "@mikro-orm/core";
import {BaseEntity} from "@common/database/base-entity.entity";
import {Post} from "./post.entity";
import {HelperService} from "@common/helpers/helpers.utils";

@Entity()
export class User extends BaseEntity {
  @Property({
    length: 50
  })
  fullName: string

  @Property({
    length: 250,
    nullable: true
  })
  bio?: string

  @Property({
    length: 50,
    nullable: true
  })
  website?: string

  @Property({
    length: 50,
    nullable: true
  })
  avatar?: string

  @Property({
    length: 60,
    unique: true
  })
  email: string

  @OneToMany(() => Post, post => post.user, {hidden: true, default: null})
  posts = new Collection<Post>(this)

  @Property({
    length: 50
  })
  username: string

  @Property({hidden: true, default: null})
  password: string

  // when ManyToMany not determine entity or mapper, this entity of table should be the owner between this two entity
  @ManyToMany({hidden: true, default: null})
  favorites = new Collection<Post>(this)

  @ManyToMany({
    entity: () => User,
    inversedBy: u => u.followed,
    owner: true,
    pivotTable: 'user_to_follower',
    joinColumn: 'follower',
    inverseJoinColumn: 'following',
    hidden: true,
    default: null
  })
  followers = new Collection<User>(this)

  @ManyToMany(() => User, u => u.followers, {hidden: true, default: null})
  followed = new Collection<User>(this)

  @Property({
    default: 0
  })
  postCount: number

  @BeforeCreate()
  @BeforeUpdate()
  async hashPassword() {
    this.password = await HelperService.hashString(this.password)
  }

  toJSON() {
    const o = wrap<User>(this).toObject() as UserDTO

    o.avatar =
      this.avatar ||
      'https://static.productionready.io/images/smiley-cyrus.jpg'

    return o
  }
}

// type UserDTO = EntityDTO<User> & {
//   following?: boolean
// }

interface UserDTO extends EntityDTO<User> {
  following?: boolean
}