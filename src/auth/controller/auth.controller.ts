import { Controller, Post, Body, HttpStatus } from '@nestjs/common';
import { AuthService } from '../providers/auth.service';
import { CreateUserDto } from '../dto/create-auth.dto';
import { LoginDto } from '../dto/login.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { VerifyEmailDto } from '../dto/verify-email.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    description: 'creates a new user',
    summary: 'create a new user profile',
  })
  @ApiResponse({
    description: 'user created successfully',
    status: HttpStatus.CREATED,
  })
  @Post('create-user')
  async createUser(@Body() dto: CreateUserDto) {
    return await this.authService.createUser(dto);
  }

  @ApiOperation({
    description: 'verifies user email',
    summary: 'verify user email',
  })
  @ApiResponse({
    description: 'email verified successfully',
    status: 201,
  })
  @Post('verify-email')
  async verifyEmailAndLogin(@Body() dto: VerifyEmailDto) {
    return await this.authService.verifyCodeAndLogin(dto);
  }

  @ApiOperation({
    description: 'authenticates user login and sends a token',
    summary: 'user login',
  })
  @ApiResponse({
    description: 'user login successful',
    status: 200,
  })
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return await this.authService.login(dto);
  }
}
