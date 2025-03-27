import { Module } from '@nestjs/common'
import { JoiPipe } from 'nestjs-joi'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { OrdersModule } from './orders/orders.module'
import { APP_PIPE } from "@nestjs/core"

@Module({
  imports: [OrdersModule],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_PIPE,
    useClass: JoiPipe,
  }],
})
export class AppModule { }
