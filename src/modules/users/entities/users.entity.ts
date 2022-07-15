import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, BaseEntity } from 'typeorm';
import { Exclude } from 'class-transformer';
import { UserRole, UserStatus, UserVerifyEmail, UserVerifyPhone } from '../enums';

@Entity('users')
export class Users extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ default: UserRole.USER })
  role: UserRole;

  @Column({ default: UserStatus.INACTIVE })
  status: UserStatus;

  @Exclude()
  @Column()
  password: string;

  @Column({ name: 'email_verified', default: UserVerifyEmail.NO })
  emailVerified: UserVerifyEmail;

  @Column({ name: 'phone_verified', default: UserVerifyPhone.NO })
  phoneVerified: UserVerifyPhone;

  @Column({ name: 'user_name' })
  userName: string;

  @Column({ name: 'first_name', nullable: true })
  firstName: string;

  @Column({ name: 'last_name', nullable: true })
  lastName: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  about: string;

  @Column({ nullable: true, name: 'last_login' })
  lastLogin: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({
    name: 'updated_at',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
