import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole } from '../../auth/enum/user-role.enum';
import { User } from '../../user/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AdminLoginDto } from '../dtos/login.dto';
import { AuthService } from '../../auth/providers/auth.service';

@Injectable()
export class AdminService {
  private logger = new Logger(AdminService.name);
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private configService: ConfigService,
    private readonly authService: AuthService,
  ) { }

  async onModuleInit() {
    await this.seedSuperAdmin();
  }

  async seedSuperAdmin() {
    try {
      const user = await this.userRepository.findOne({
        where: { role: UserRole.ADMIN },
        order: { createdAt: 'ASC' },
      });
      if (user) {
        this.logger.log('Admin user already exists, skipping seed');
        return;
      }
      const seedAdmin = this.configService.get<string>('ADMIN_EMAIL');
      if (!seedAdmin) {
        this.logger.log('Admin seeding disabled (SEED_ADMIN_EMAIL not set)');
        return;
      }
      const firstname = this.configService.get<string>('ADMIN_FIRSTNAME');
      const lastname = this.configService.get<string>('ADMIN_LASTNAME');
      const phone = this.configService.get<string>('ADMIN_PHONE');
      const password = this.configService.get<string>('ADMIN_PASSWORD');
      if (!password) {
        this.logger.warn(
          'Admin seeding failed: Missing required environment variables',
        );
        return;
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const admin = this.userRepository.create({
        firstName: firstname,
        lastName: lastname,
        phone: phone,
        password: hashedPassword,
        email: seedAdmin,
        isEmailVerified: true,
        role: UserRole.ADMIN,
      });
      await this.userRepository.save(admin);
      this.logger.log(`SuperAdmin profile created successfully: ${seedAdmin}`);
    } catch (error: unknown) {
      if (error instanceof Error)
        this.logger.error(
          `Error creating Admin profile: ${error.message}`,
          error.stack,
        );
    }
  }

  async adminLogin(dto: AdminLoginDto) {
    try {
      const admin = await this.userRepository.findOne({
        where: {
          email: dto.email,
          role: UserRole.ADMIN,
        },
        select: ['email', 'password', 'id', 'role'],
      });
      if (!admin) {
        throw new NotFoundException('Admin account not found');
      }
      const isPasswordValid = await bcrypt.compare(
        dto.password,
        admin.password,
      );
      if (!isPasswordValid) {
        throw new UnauthorizedException('Password is incorrect, try again');
      }
      const validate = await this.authService.validateLoginPayload(
        admin.id,
        admin.email,
        admin.role,
      );
      return {
        message: 'Successfully validated user',
        success: true,
        token: validate.token,
      };
    } catch (error: unknown) {
      if (error instanceof Error)
        this.logger.error(
          `Failed to authenticate user: ${error.message}`,
          error.stack,
        );
      return {
        message: 'Error authenticating user',
        success: false,
      };
    }
  }
}
