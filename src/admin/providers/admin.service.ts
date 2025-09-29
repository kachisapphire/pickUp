import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { UserRole } from "src/auth/enum/user-role.enum";
import { User } from "src/user/entities/user.entity";
import { Repository } from "typeorm";
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
    private logger = new Logger(AdminService.name);
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private configService: ConfigService,
    ) { }

    async onModuleInit() {
        await this.seedSuperAdmin();
    }

    async seedSuperAdmin() {
        try {
            const user = await this.userRepository.findOne({
                where: { role: UserRole.ADMIN },
                order: { createdAt: 'ASC' }
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
            const firstname = await this.configService.get<string>('ADMIN_FIRSTNAME');
            const lastname = await this.configService.get<string>('ADMIN_LASTNAME');
            const phone = await this.configService.get<string>('ADMIN_PHONE');
            const password = await this.configService.get<string>('ADMIN_PASSWORD');
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
                role: UserRole.ADMIN
            });
            await this.userRepository.save(admin);
            this.logger.log(`SuperAdmin profile created successfully: ${seedAdmin}`);
        }
        catch (error) {
            this.logger.error(`Error creating Admin profile: ${error.message}`, error.stack)
        }
    }
}