import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/user/entities/user.entity";
import { AdminService } from "./providers/admin.service";
import { ConfigService } from "@nestjs/config";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            User,
        ])
    ],
    controllers: [],
    providers: [AdminService,
    ]
})
export class AdminModule { }