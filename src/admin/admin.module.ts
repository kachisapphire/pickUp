import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { AdminService } from './providers/admin.service';
import { AuthModule } from '../auth/auth.module';
import { AdminController } from './controllers/admin.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User]), AuthModule],
  controllers: [AdminController],
  providers: [
    AdminService,
    //AuthService,
  ],
})
export class AdminModule { }
