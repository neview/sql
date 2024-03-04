import { Body, Controller, Get, HttpStatus, Param, Post, Query, UnauthorizedException } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiBasicAuth, ApiBearerAuth, ApiBody, ApiCookieAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CccDto } from './ccc.dto';
import { CccVo } from './ccc.vo';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  // ApiOperation：声明接口信息
  // ApiResponse：声明响应信息，一个接口可以多种响应
  // ApiQuery：声明 query 参数信息
  // ApiParam：声明 param 参数信息
  // ApiBody：声明 body 参数信息，可以省略
  // ApiProperty：声明 dto、vo 的属性信息
  // ApiPropertyOptional：声明 dto、vo 的属性信息，相当于 required: false 的 ApiProperty
  // ApiTags：对接口进行分组
  // ApiBearerAuth：通过 jwt 的方式认证，也就是 Authorization: Bearer xxx
  // ApiCookieAuth：通过 cookie 的方式认证
  // ApiBasicAuth：通过用户名、密码认证，在 header 添加 Authorization: Basic xxx

  @ApiBearerAuth('bearer')
  @ApiTags('xxx')
  @ApiOperation({ summary: '测试 aaa', description: 'aaa 描述' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'aaa 成功',
    type: String
  })
  @ApiQuery({
    name: 'a1',
    type: String,
    description: 'a1 param',
    required: false,
    example: '1111',
  })
  @ApiQuery({
    name: 'a2',
    type: Number,
    description: 'a2 param',
    required: true,
    example: 2222,
  })


  @Get('aaa')
  aaa(@Query('a1') a1, @Query('a2') a2) {
    console.log(a1, a2);
    return 'aaa success';
  }

  @ApiCookieAuth('cookie')
  @ApiOperation({ summary: '测试 bbb', description: 'bbb 描述' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'bbb 成功',
    type: String
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'id 不合法',
  })
  @ApiParam({
    name: 'id',
    description: 'ID',
    required: true,
    example: 222,
  })

  @Get('bbb/:id')
  bbb(@Param('id') id: number) {
    console.log(id);
    if (id !== 111) {
      throw new UnauthorizedException();
    }
    return 'bbb success';
  }

  @ApiBasicAuth('basic')
  @ApiOperation({ summary: '测试 ccc' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'ccc 成功',
    type: CccVo
  })

  @ApiBody({
    type: CccDto
  })

  @Post('ccc')
  ccc(@Body('ccc') ccc: CccDto) {
    console.log(ccc);
    // return 'ccc success';
    const vo = new CccVo()
    vo.aaa = 111;
    vo.bbb = 222;
    return vo
  }


  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
