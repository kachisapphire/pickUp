import { randomInt } from "crypto";
import { UserRole } from "../enum/user-role.enum";
import { CreateUserDto } from "../dto/create-auth.dto";
import { MailService } from "./mail.service";
import { BadRequestException, Inject, Injectable, Logger, NotFoundException, UnauthorizedException } from "@nestjs/common";
//import { ConfigService } from "@nestjs/config";
import { User } from "src/user/entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { LoginDto } from "../dto/login.dto";
import * as bcrypt from 'bcrypt'
// import { CACHE_MANAGER } from "@nestjs/cache-manager";
// import { Cache } from "cache-manager";
import { VerifyEmailDto } from "../dto/verify-email.dto";
import redis from "src/utils/redis";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    //@Inject(CACHE_MANAGER) private cacheManager: Cache,
    //private configService: ConfigService,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
  ) { }
  async createUser(dto: CreateUserDto) {
    try {
      const user = await this.userRepository.findOne({
        where: { email: dto.email }
      })
      if (user) {
        return {
          message: 'user with this email already exists',
          success: false
        }
      }
      const hashedPassword = await bcrypt.hash(dto.password, 10);
      const newUser = this.userRepository.create({
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        phone: dto.phone,
        password: hashedPassword,
        role: dto.role
      });
      const savedUser = await this.userRepository.save(newUser);

      try {
        const code = await this.generateEmailConfirmationCode();
        //await this.cacheManager.set(savedUser.email, code, 600);
        await redis.setEx(savedUser.email, 600, code)
        await this.mailService.sendVerificationCode(savedUser.email, code);
        return {
          message: 'user created successfully and verification code sent',
          success: true,
          data: savedUser
        }
      }
      catch (emailError) {
        console.error(`Failed to send email: ${emailError}`);
        return {
          message: 'Email sending failed, user profile created',
          success: true,
          data: savedUser
        }
      }
    }
    catch (error) {
      console.error(`Failed to create user: ${error}`);
      return {
        message: 'Error creating user',
        success: false
      }
    }
  }

  async verifyCodeAndLogin(dto: VerifyEmailDto) {
    try {
      const storedCode = await redis.get(dto.email)
      if (!storedCode) {
        throw new NotFoundException('code has expired, please request for a new one');
      }
      if (storedCode !== dto.code) {
        throw new BadRequestException('Invalid code, please check the code and try again');
      }
      const user = await this.userRepository.findOne({
        where: { email: dto.email }
      });
      if (!user) {
        throw new NotFoundException('User does not exist')
      }
      user.isEmailVerified = true;
      await this.userRepository.save(user);
      const validate = await this.validateLoginPayload(user.id, user.email, user.role);
      return {
        success: true,
        message: 'User verified successfully',
        token: validate.token
      }
    }
    catch (error) {
      this.logger.error(`Failed to verify email: ${error.message}`, error.stack);
      return {
        success: false,
        message: 'Error verifying email'
      }
    }
  }

  private async generateEmailConfirmationCode() {
    return randomInt(1000_000).toString().padStart(4, '0');
  }

  async login(dto: LoginDto) {
    try {
      const user = await this.userRepository.findOne({
        where: {
          email: dto.email,
          role: UserRole.USER
        },
        select: ['email', 'password', 'id', 'role']
      });
      if (!user) {
        throw new NotFoundException('account not found, please create an account or try again')
      }
      const isPasswordValid = await bcrypt.compare(dto.password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Incorrect password, please check your password and try again')
      }
      const validate = await this.validateLoginPayload(user.id, user.email, user.role);
      return {
        message: 'Successfully validated user',
        success: true,
        token: validate.token
      }
    }
    catch (error) {
      this.logger.error(`Failed to authenticate user: ${error.message}`, error.stack);
      return {
        message: 'Error authenticating user',
        success: false
      }
    }
  }

  async validateLoginPayload(id: string, email: string, role: UserRole) {
    try {
      const payload = {
        sub: id,
        email: email,
        role: role
      }
      const token = await this.jwtService.signAsync(payload);
      return {
        message: 'Successfully validated user',
        success: false,
        token
      }
    }
    catch (error) {
      this.logger.error(`Failed to validate user: ${error.message}`, error.stack);
      return {
        message: 'Error validating user',
        success: false
      }
    }
  }
}
