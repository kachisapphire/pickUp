import { User } from 'src/user/entities/user.entity';

declare global {
    namespace Express {
        interface Session {
            user?: User;
        }
    }
}
