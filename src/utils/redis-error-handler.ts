import { Logger } from "@nestjs/common";

export function createRedisErrorHandler(serviceName: string) {
    const logger = new Logger(serviceName);

    return {
        handleError: (err: any) => {
            logger.error(`Redis connection error: ${err.message}`, err.stack);
        },
        handleReconnect: () => {
            logger.log('Redis connection re-established');
        },
    };
}