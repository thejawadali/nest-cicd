import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  readonly users = [
    { id: 1, name: 'John' },
    { id: 2, name: 'Doe1' },
  ];

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/users')
  getUsers(): { id: number; name: string }[] {
    return this.users;
  }
}
