import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, Query, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { EmailService } from '../email/email.service';
import { RedisService } from '../redis/redis.service';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Inject(EmailService)
  private emailService: EmailService;

  @Inject(RedisService)
  private redisService: RedisService;

  /**
   * 生成并发送注册验证码
   * @param address 用户邮箱地址, 作为验证码的唯一标识
   * @returns 返回发送成功的提示信息
   */
  @Get('register-captcha')
  async captcha(@Query('address') address: string) {
    const code = Math.random().toString().slice(2, 8);
    await this.redisService.set(`captcha_${address}`, code, 5 * 60)
    await this.emailService.sendMail({
      to: address,
      subject: '注册验证码',
      html: `<h1>验证码：${code}</h1>`
    })
    return '发送成功'
  }

  /**
 * 用户注册接口
 * @Post('register') 指定请求方法和路由为'register'
 * @Body() registerUser: RegisterUserDto 接收请求体中的用户注册信息
 * @returns 返回异步调用userService.register方法的结果
 */
  @Post('register')
  async register(@Body() registerUser: RegisterUserDto) {
    return await this.userService.register(registerUser);
  }

  /**
 * 初始化数据接口
 * 本接口不接受任何参数
 * 
 * @returns {string} 返回字符串"done"，表示数据初始化完成
 */
  @Get('init-data')
  async initData() {
    await this.userService.initData();
    return "done"
  }

  /**
 * 处理用户登录请求的函数。
 * 
 * @param loginUser - 包含登录信息的用户对象，来自请求体（Body）。
 * @returns 返回一个表示登录成功与否的字符串。
 */

  @Inject(JwtService)
  private jwtService: JwtService

  @Inject(ConfigService)
  private configService: ConfigService

  /**
 * 处理用户登录请求。
 * @param loginUser 包含登录所需信息的对象，例如用户名和密码。
 * @returns 返回一个包含访问令牌（accessToken）和刷新令牌（refreshToken）的对象。
 */
  @Post('login')
  async userLogin(@Body() loginUser: LoginUserDto) {
    const vo = await this.userService.login(loginUser, false);
    vo.accessToken = this.jwtService.sign({
      userId: vo.userInfo.id,
      username: vo.userInfo.username,
      roles: vo.userInfo.roles,
      permissions: vo.userInfo.permissions
    }, {
      expiresIn: this.configService.get('jwt_access_token_expires_time') || '30m'
    });

    vo.refreshToken = this.jwtService.sign({
      userId: vo.userInfo.id
    }, {
      expiresIn: this.configService.get('jwt_refresh_token_expres_time') || '7d'
    });

    return vo;
  }

  /**
   * 刷新令牌接口。
   * 通过传入的刷新令牌（refreshToken）验证用户身份，并生成新的访问令牌（accessToken）和刷新令牌（refreshToken）。
   * 
   * @param refreshToken 用户的刷新令牌，用于请求新的访问令牌。
   * @returns 返回包含新生成的访问令牌和刷新令牌的对象。
   * @throws 如果刷新令牌无效或已过期，则抛出未授权异常（UnauthorizedException）。
   */
  @Get('refresh')
  async refresh(@Query('refreshToken') refreshToken: string) {
    try {
      const data = this.jwtService.verify(refreshToken);

      const user = await this.userService.findUserById(data.userId, false);

      const access_token = this.jwtService.sign({
        userId: user.id,
        username: user.username,
        roles: user.roles,
        permissions: user.permissions
      }, {
        expiresIn: this.configService.get('jwt_access_token_expires_time') || '30m'
      });

      const refresh_token = this.jwtService.sign({
        userId: user.id
      }, {
        expiresIn: this.configService.get('jwt_refresh_token_expres_time') || '7d'
      });

      return {
        access_token,
        refresh_token
      }
    } catch (e) {
      throw new UnauthorizedException('token 已失效，请重新登录');
    }
  }

  /**
 * 处理管理员登录请求的函数。
 * 
 * @param loginUser - 包含登录信息的实体，来自请求体（Body）。
 * @returns 返回一个字符串表示登录状态，这里固定为'success'。
 */
  @Post('admin/login')
  async adminLogin(@Body() loginUser: LoginUserDto) {
    const vo = await this.userService.login(loginUser, true);
    vo.accessToken = this.jwtService.sign({
      userId: vo.userInfo.id,
      username: vo.userInfo.username,
      roles: vo.userInfo.roles,
      permissions: vo.userInfo.permissions
    }, {
      expiresIn: this.configService.get('jwt_access_token_expires_time') || '30m'
    });

    vo.refreshToken = this.jwtService.sign({
      userId: vo.userInfo.id
    }, {
      expiresIn: this.configService.get('jwt_refresh_token_expres_time') || '7d'
    });

    return vo;
  }

  @Get('admin/refresh')
  async adminRefresh(@Query('refreshToken') refreshToken: string) {
    try {
      const data = this.jwtService.verify(refreshToken);

      const user = await this.userService.findUserById(data.userId, true);

      const access_token = this.jwtService.sign({
        userId: user.id,
        username: user.username,
        roles: user.roles,
        permissions: user.permissions
      }, {
        expiresIn: this.configService.get('jwt_access_token_expires_time') || '30m'
      });

      const refresh_token = this.jwtService.sign({
        userId: user.id
      }, {
        expiresIn: this.configService.get('jwt_refresh_token_expres_time') || '7d'
      });

      return {
        access_token,
        refresh_token
      }
    } catch (e) {
      throw new UnauthorizedException('token 已失效，请重新登录');
    }
  }


  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
