import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import envConfig from './config/env.config';
import { AppController } from './features/app/app.controller';
import { AppService } from './features/app/app.service';
import { AuthModule, JwtAsyncModule, AuthService, JwtRefreshService } from './features/auth';
import { EventsModule } from './features/events/events.module';
import { GamesModule } from './features/games/games.module';
import { MessagesModule } from './features/messages/messages.module';
import { UsersModule } from './features/users/users.module';

// TODO: Add global filter to return success object
// on empty response with status code 200
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [envConfig],
      cache: true,
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      autoLoadEntities: true,
      synchronize: false,
      migrationsRun: true,
      migrations: [__dirname + '/migrations/*.{ts,js}'],
      ...envConfig().database,
    }),
    UsersModule,
    AuthModule,
    JwtAsyncModule,
    GamesModule,
    EventsModule,
    MessagesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AuthService,
    JwtRefreshService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
