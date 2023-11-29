import { Controller, Get, Session, Inject, Res, UnauthorizedException } from '@nestjs/common';
import { AppService } from './app.service';
import session from 'express-session';
import { JwtService } from '@nestjs/jwt';
import { Response, response } from 'express';
import { Headers } from '@nestjs/common/decorators/http/route-params.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Inject(JwtService)
  private jwtService: JwtService

  @Get("sss")
  sss(@Session() session) {
    console.log(session)
    session.count = session.count ? session.count + 1 : 1;
    return session.count;
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // @Get('ttt')
  // // 这里使用 jwtService.sign 来生成一个 jwt token，放到 response header 里
  // // 因为注入 response 对象之后，默认不会把返回值作为 body 了，需要设置 passthrough 为 true 才可以
  // ttt(@Res({ passthrough: true }) response: Response) {
  //   const newToken = this.jwtService.sign({
  //     count: 1
  //   });

  //   response.setHeader('token', newToken);
  //   return 'hello';
  // }

  @Get('ttt')
  ttt(@Headers('authorization') authorization: string, @Res({ passthrough: true }) response: Response) {
    if (authorization) {
      try {
        const token = authorization.split(' ')[1];
        const data = this.jwtService.verify(token);

        const newToken = this.jwtService.sign({
          count: data.count + 1
        })
        response.setHeader('token', newToken);
        return data.count + 1
      } catch (e) {
        console.log(e);
        throw new UnauthorizedException();
      }
    } else {
      const newToken = this.jwtService.sign({
        count: 1
      })

      response.setHeader('token', newToken);
      return 1
    }
  }

}
