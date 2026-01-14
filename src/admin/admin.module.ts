import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/user/entities/user.entity";
import { AdminService } from "./providers/admin.service";
import { ConfigService } from "@nestjs/config";
import { AuthService } from "src/auth/providers/auth.service";
import { AuthModule } from "src/auth/auth.module";
import { AdminController } from "./controllers/admin.controller";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            User,
        ]),
        AuthModule,
    ],
    controllers: [AdminController],
    providers: [AdminService,
        //AuthService,
    ]
})
export class AdminModule { }