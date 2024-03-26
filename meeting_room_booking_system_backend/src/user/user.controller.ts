import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, Query, UnauthorizedException, ParseIntPipe, BadRequestException, DefaultValuePipe, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { EmailService } from '../email/email.service';
import { RedisService } from '../redis/redis.service';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RequireLogin, UserInfo } from '../custom.decorator';
import { UserDetailVo } from './vo/user-info.vo';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { generateParseIntPipe } from '../utils';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginUserVo } from './vo/login-user.vo';
import { RefreshTokenVo } from './vo/refresh-token.vo';

@ApiTags('用户管理模块')
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
   * @ApiQuery 描述query参数
   * @ApiResponse 描述接口响应信息
   */
  @ApiQuery({
    name: 'address',
    type: String,
    description: '邮箱地址',
    required: true,
    example: 'xxx@xx.com'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '发送成功',
    type: String
  })
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
  @ApiBody({ type: RegisterUserDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '注册成功/失败',
    type: String
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '验证码已失效/验证码不正确/用户已存在',
    type: String
  })
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
  @ApiBody({
    type: LoginUserDto
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '用户不存在/密码错误',
    type: String
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '用户信息和 token',
    type: LoginUserVo
  })
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
  @ApiQuery({
    name: 'refreshToken',
    type: String,
    description: '刷新 token',
    required: true,
    example: 'xxx'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'token 已失效，请重新登录',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '刷新成功',
    type: RefreshTokenVo
  })
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

      const vo = new RefreshTokenVo()
      vo.access_token = access_token;
      vo.refresh_token = refresh_token;

      return vo
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
  @ApiBody({
    type: LoginUserDto
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '用户不存在/密码错误',
    type: String
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '用户信息和 token',
    type: LoginUserVo
  })
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

  /**
   * 获取用户详细信息
   * 路径：GET /info
   * 需要登录
   * 参数：
   * - userId：用户ID，由UserInfo装饰器从token中提取
   * 返回值：UserDetailVo对象，包含用户的详细信息
   */
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'success',
    type: UserDetailVo
  })
  @Get('info')
  @RequireLogin()
  async info(@UserInfo('userId') userId: number) {
    const user = await this.userService.findUserDetailById(userId);

    const vo = new UserDetailVo()
    vo.id = user.id;
    vo.email = user.email;
    vo.username = user.username;
    vo.headPic = user.headPic;
    vo.phoneNumber = user.phoneNumber;
    vo.nickName = user.nickName;
    vo.createTime = user.createTime;
    vo.isFrozen = user.isFrozen;

    return vo;
  }

  /**
 * 更新用户密码
 * 路径: update_password, admin/update_password
 * 需要用户登录
 * 
 * @param userId 用户ID，由@UserInfo('userId')从用户信息中提取
 * @param passwordDto 包含新密码信息的数据传输对象，由@Body()获取
 * @returns 返回更新密码操作的结果
 */
  @ApiBearerAuth()
  @ApiBody({
    type: UpdateUserPasswordDto
  })
  @ApiResponse({
    type: String,
    description: '验证码已失效/不正确'
  })
  @Post(['update_password', 'admin/update_password'])
  @RequireLogin()
  async updatePassword(@UserInfo('userId') userId: number, @Body() passwordDto: UpdateUserPasswordDto) {
    return await this.userService.updatePassword(userId, passwordDto);
  }

  @Get('update_password/captcha')
  async updatePasswordCaptcha(@Query('address') address: string) {
    const code = Math.random().toString(36).substring(2, 8);

    await this.redisService.set(`update_password_captcha_${address}`, code, 10 * 60);

    await this.emailService.sendMail({
      to: address,
      subject: '重置密码',
      html: `<p>你的更改密码验证码是 ${code}</p>`
    })

    return '发送成功'
  }

  /**
  * 获取更新用户信息的验证码
  * @param address 用户的邮箱地址，作为验证码发送的目标
  * @returns 返回一个字符串表示发送成功
  */
  @ApiBearerAuth()
  @ApiQuery({
    name: 'address',
    description: '用户邮箱地址',
    type: String
  })
  @ApiResponse({
    type: String,
    description: '发送成功'
  })
  @RequireLogin()
  @Get('update/captcha')
  async updateCaptcha(@Query('address') address: string) {
    const code = Math.random().toString().slice(2, 8);

    await this.redisService.set(`update_user_captcha_${address}`, code, 10 * 60);

    await this.emailService.sendMail({
      to: address,
      subject: '更改用户信息验证码',
      html: `<p>你的验证码是 ${code}</p>`
    });
    return '发送成功';
  }


  /**
 * 更新用户信息。
 * 该接口适用于管理员更新用户信息的场景。
 * 
 * @param userId 用户ID，由@UserInfo('userId')从请求中提取。
 * @param updateUserDto 更新用户信息的数据传输对象，包含要更新的用户信息。
 * @returns 返回更新操作的结果，通常是一个包含成功标识和消息的对象。
 */
  @ApiBearerAuth()
  @ApiBody({
    type: UpdateUserDto
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '验证码已失效/不正确'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '更新成功',
    type: String
  })
  @Post(['update', 'admin/update'])
  @RequireLogin()
  async update(@UserInfo('userId') userId: number, @Body() updateUserDto: UpdateUserDto) {
    return await this.userService.update(userId, updateUserDto);
  }

  /**
 * 冻结用户
 * @param userId 用户ID，通过查询参数传递
 * @returns 返回字符串'success'，表示操作成功
 */
  @ApiBearerAuth()
  @ApiQuery({
    name: 'id',
    description: 'userId',
    type: Number
  })
  @ApiResponse({
    type: String,
    description: 'success'
  })
  @RequireLogin()

  @Get('freeze')
  async freeze(@Query('id') userId: number) {
    await this.userService.freezeUserById(userId)
    return 'success'
  }

  @ApiBearerAuth()
  @ApiQuery({
    name: 'pageNo',
    description: '第几页',
    type: Number
  })
  @ApiQuery({
    name: 'pageSize',
    description: '每页多少条',
    type: Number
  })
  @ApiQuery({
    name: 'username',
    description: '用户名',
    type: Number
  })
  @ApiQuery({
    name: 'nickName',
    description: '昵称',
    type: Number
  })
  @ApiQuery({
    name: 'email',
    description: '邮箱地址',
    type: Number
  })
  @ApiResponse({
    type: String,
    description: '用户列表'
  })
  @RequireLogin()

  @Get('list')
  // async list(@Query('pageNo', new ParseIntPipe({
  //   exceptionFactory() {
  //     return new BadRequestException('pageNo 参数必须是数字')
  //   }
  // })) pageNo: number, @Query('pageSize', new ParseIntPipe({
  //   exceptionFactory() {
  //     throw new BadRequestException('pageSize 参数必须是数字')
  //   }
  // })) pageSize: number) {
  //   return await this.userService.findUsersByPage(pageNo, pageSize);
  // }
  async list(
    @Query('pageNo', new DefaultValuePipe(1), generateParseIntPipe('pageNo')) pageNo: number,
    @Query('pageSize', new DefaultValuePipe(2), generateParseIntPipe('pageSize')) pageSize: number,
    @Query('username') username: string,
    @Query('nickName') nickName: string,
    @Query('email') email: string
  ) {
    return await this.userService.findUsers(username, nickName, email, pageNo, pageSize);
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

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
