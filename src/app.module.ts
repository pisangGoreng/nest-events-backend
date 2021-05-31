import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import ormConfig from './config/orm.config';
import ormConfigProd from './config/orm.config.prod';
import { EventsModule } from './events/events.module';
import { SchoolModule } from './school/school.module';

// for checking .env file in root directory and parse it to process.env
const envConfig = ConfigModule.forRoot({
  isGlobal: true,
  load: [ormConfig],
  expandVariables: true
})

// Configs for connect to mysql (docker) with typeorm
const dbConfig = TypeOrmModule.forRootAsync({
  useFactory: process.env.NODE_ENV === 'production' ? ormConfigProd : ormConfig
})

@Module({
  imports: [
    envConfig,
    dbConfig,
    EventsModule, // ! inject events.module.ts
    SchoolModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

