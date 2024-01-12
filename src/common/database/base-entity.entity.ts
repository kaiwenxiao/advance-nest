import {PrimaryKey, Property} from "@mikro-orm/core";
import {Exclude} from "class-transformer";

export abstract class BaseEntity {
  @PrimaryKey({hidden: true})
  id!: number

  @Property({defaultRaw: 'uuid_generate_v4()'})
  idx: string

  @Property({
    nullable: false,
    default: true
  })
  isActive: boolean


  /**
   * import { Exclude } from 'class-transformer';
   *
   * class User {
   *  id: number;
   *  name: string;
   *
   *  @Exclude({ toPlainOnly: true })
   *  password: string;
   * }
   *
   * const user = new User();
   * user.id = 1;
   * user.name = 'John Doe';
   * user.password = 'secret';
   *
   * import { classToPlain } from 'class-transformer';
   *
   * const plainUser = classToPlain(user);
   *
   * console.log(plainUser); // Outputs: { id: 1, name: 'John Doe' }
   */
  // TODO what it means
  @Exclude({toPlainOnly: true})
  @Property({
    nullable: false,
    default: false
  })
  isObsolete: boolean

  @Property({nullable: true})
  deletedAt?: Date

  @Property({defaultRaw: 'CURRENT_TIMESTAMP'})
  createdAt: Date = new Date()

  @Exclude({toPlainOnly: true})
  @Property({
    defaultRaw: 'CURRENT_TIMESTAMP',
    nullable: true,
    onUpdate: () => new Date()
  })
  updatedAt?: Date = new Date()
}