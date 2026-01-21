import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { createRedisErrorHandler } from './utils/redis-error-handler';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { AdminModule } from './admin/admin.module';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { OrderModule } from './order/order.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthModule,
    UserModule,
    CategoryModule,
    ProductModule,
    AdminModule,
    OrderModule,
    PaymentModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        if (process.env.DATABASE_URL) {
          return {
            type: 'postgres',
            url: process.env.DATABASE_URL,
            ssl: {
              rejectUnauthorized: false,
            },
            extra: {
              ssl: {
                rejectUnauthorized: false,
              },
            },
            autoLoadEntities: true,
            synchronize: false,
            logging: true,
          };
        }
        return {
          type: 'postgres',
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_NAME'),
          autoLoadEntities: true,
          synchronize: false,
          logging: true,
          retryAttempts: 3,
          retryDelay: 3000,
        };
      },
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const redisErrorHandler = createRedisErrorHandler('CacheModule');
        const redisUrl = configService.get<string>('REDIS_URL');
        if (redisUrl) {
          return {
            store: redisStore({
              url: redisUrl,
              socket: {
                tls: true,
                rejectUnauthorized: false,
                reconnectStrategy: (retries) => {
                  if (retries > 10) {
                    return new Error('Connection refused by server');
                  }
                  if (retries > 0) {
                    redisErrorHandler.handleError(
                      new Error('Initial connection failed'),
                    );
                    return new Error('The server refused the connection');
                  }
                  // Retry with exponential backoff
                  return Math.min(retries * 100, 3000);
                },
              },
            }),
            max: configService.get<number>('CACHE_MAX', 100), // Default max
            ttl: configService.get<number>('CACHE_TTL', 60), // Default ttl
          };
        }
        return {
          store: redisStore({
            socket: {
              host: configService.get<string>('REDIS_HOST', 'localhost'),
              port: configService.get<number>('REDIS_PORT', 6379),
              reconnectStrategy: (retries) => {
                if (retries > 10) {
                  return new Error('Retry attempts exhausted');
                }
                if (retries > 0) {
                  redisErrorHandler.handleError(
                    new Error('Initial connection failed'),
                  );
                }
                return Math.min(retries * 100, 3000);
              },
            },
          }),
          max: configService.get<number>('CACHE_MAX', 100),
          ttl: configService.get<number>('CACHE_TTL', 60),
        };
      },
    }),
    DevtoolsModule.register({
      http: process.env.NODE_ENV !== 'production',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
