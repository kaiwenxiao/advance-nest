import {Module} from "@nestjs/common";
import {MikroOrmModule} from '@mikro-orm/nestjs';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {LoadStrategy} from "@mikro-orm/core";
import {SqlHighlighter} from "@mikro-orm/sql-highlighter";
import {TsMorphMetadataProvider} from "@mikro-orm/reflection";
import * as Entities from '@entities'

@Module({
  imports: [
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgresql',
        host: configService.get('database.host'),
        port: configService.get<number>('database.port'),
        password: configService.get('database.password'),
        user: configService.get('database.username'),
        dbName: configService.get('database.dbName'),
        entities: ['dist/**/*.entity.js'],
        entitiesTs: ['src/**/*.entity.ts'],
        debug: true,
        loadStrategy: LoadStrategy.JOINED,
        highlighter: new SqlHighlighter(),
        registerRequestContext: false,
        // infer the property type in SQL (static), but class-validator (active)
        metadataProvider: TsMorphMetadataProvider
      }),
      inject: [ConfigModule]
    }),
    MikroOrmModule.forFeature({
      entities: [...Object.values(Entities)]
    })
  ],
  exports: [MikroOrmModule]
})
export class OrmModule {}