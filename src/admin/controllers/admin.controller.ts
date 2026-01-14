import { Body, Controller, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AdminService } from "../providers/admin.service";
import { AdminLoginDto } from "../dtos/login.dto";

@Controller('admin')
@ApiTags('Admin')
export class AdminController {
    constructor(
        private readonly adminService: AdminService
    ) { }

    @ApiOperation({
        summary: 'Authenticates admin user',
        description: 'authenticates admin user'
    })
    @ApiResponse({
        description: 'Successfully logged in',
        status: 201
    })
    @Post('login')
    async adminLogin(
        @Body() dto: AdminLoginDto
    ) {
        return await this.adminService.adminLogin(dto);
    }
}