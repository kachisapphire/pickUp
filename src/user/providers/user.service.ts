import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from '../dtos/update-user.dto';

@Injectable()
export class UserService {
  private logger = new Logger(UserService.name);
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getAllUsers() {
    try {
      const users = await this.userRepository.find();
      const mappedUsers = users.map((user) => ({
        id: user.id,
        userName: `${user.firstName} ${user.lastName}`,
        email: user.email,
        phoneNumber: user.password,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt.toLocaleDateString('en-CA'),
      }));
      return {
        message: 'Successfully fetched all users',
        success: true,
        mappedUsers,
      };
    } catch (error) {
      this.logger.error(
        `Failed to get all user: ${error.message}`,
        error.stack,
      );
      return {
        message: 'Error getting all users',
        success: false,
      };
    }
  }

  async getUserById(userId: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
      return {
        message: 'Successfully retrieved user details',
        success: true,
        data: {
          id: user.id,
          userName: `${user.firstName} ${user.lastName}`,
          email: user.email,
          phoneNumber: user.password,
          isEmailVerified: user.isEmailVerified,
          createdAt: user.createdAt.toLocaleDateString('en-CA'),
        },
      };
    } catch (error) {
      this.logger.error(
        `Failed to get user details: ${error.message}`,
        error.stack,
      );
      return {
        message: 'Error user details',
        success: false,
      };
    }
  }

  async updateUserDetail(userId: string, dto: UpdateUserDto) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
      Object.assign(user, dto);
      const updatedUser = await this.userRepository.save(user);
      return {
        message: 'Successfully updated user',
        success: true,
        updatedUser,
      };
    } catch (error) {
      this.logger.error(
        `Failed to updating user details: ${error.message}`,
        error.stack,
      );
      return {
        message: 'Error updating user details',
        success: false,
      };
    }
  }
}
