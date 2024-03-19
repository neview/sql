import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('aaa')
  aaa() {
    return 'aaa'
  }

  @Get('bbb')
  bbb() {
    return 'bbb'
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
