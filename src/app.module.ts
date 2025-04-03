import { Module } from '@nestjs/common'
import { JoiPipe } from 'nestjs-joi'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { OrdersModule } from './orders/orders.module'
import { APP_PIPE } from "@nestjs/core"
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    OrdersModule
  ],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_PIPE,
    useClass: JoiPipe,
  }],
})
export class AppModule { }
