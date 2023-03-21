import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { App } from './app.entity';
import { User } from '../../user/entities/user.entity';

@Entity()
export class GrantCode {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  code: string;

  @Column({ default: false })
  redeemed: boolean;

  @Column({ nullable: true })
  state: string;

  @OneToOne(() => App, (app) => app.id)
  @JoinColumn()
  app: App;

  @OneToOne(() => User, (user) => user.id)
  @JoinColumn()
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}
