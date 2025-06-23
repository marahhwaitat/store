import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Scopes } from '../enums/otp-scopes.enum';

@Entity()
export class Otp {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('int')
  value: number;

  @Column()
  scope: Scopes;

  @Column("datetime")
  expireAt: Date

  @ManyToOne(() => User, (user) => user.otp, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}
