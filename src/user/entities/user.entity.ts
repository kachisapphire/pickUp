import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserRole } from "../../auth/enum/user-role.enum";

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ nullable: true })
    firstName: string

    @Column({ nullable: true })
    lastName: string

    @Column()
    phone: string

    @Column({ unique: true })
    email: string

    @Column()
    country: string

    @Column({ nullable: true, select: false })
    password: string

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.USER
    })
    role: UserRole

    @Column({ default: false })
    isEmailVerified: boolean

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}