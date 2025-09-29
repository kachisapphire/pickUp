// decorators/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../enum/user-role.enum';

/**
 * Key used for role-based metadata in route handlers.
 */
export const ROLES_KEY = 'roles';

/**
 * Custom decorator to define required roles for a route.
 * @returns {CustomDecorator} - Metadata decorator to attach roles to route handlers.
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
