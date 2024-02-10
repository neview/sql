import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { LoginGuard } from './login.guard';
import { UseGuards } from '@nestjs/common';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('aaa')
  @UseGuards(LoginGuard)
  aaa() {
    return 'aaa'
  }

  @Get('bbb')
  @UseGuards(LoginGuard)
  bbb() {
    return 'bbb'
  }
}
