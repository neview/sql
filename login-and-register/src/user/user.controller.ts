// import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
// import { UserService } from './user.service';
// import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
// import { LoginDto } from './dto/login.dto';
// import { RegisterDto } from './dto/register.dto';

// @Controller('user')
// export class UserController {
//   constructor(private readonly userService: UserService) { }

//   @Post('login')
//   login(@Body() user: LoginDto) {
//     console.log(user)
//   }

//   @Post('register')
//   register(@Body() user: RegisterDto) {
//     console.log(user)
//   }

// }
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('login')
  async login(@Body() user: LoginDto) {
    const foundUser = await this.userService.login(user)
    if (foundUser) {
      return {
        message: 'Login successful',
      }
    } else {
      return {
        message: 'Login failed'
      }
    }
  }

  @Post('register')
  async register(@Body() user: RegisterDto) {
    return await this.userService.register(user);
  }
}
