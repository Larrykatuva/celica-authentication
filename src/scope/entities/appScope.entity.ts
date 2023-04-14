import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { App } from '../../application/entities/app.entity';
import { Scope } from './scope.entity';
import { User } from '../../user/entities/user.entity';

@Entity()
export class AppScope {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => App, (app) => app.scopes)
  @JoinColumn()
  app: App;

  @OneToOne(() => Scope, (scope) => scope.id)
  @JoinColumn()
  scope: Scope;

  @OneToOne(() => User, (user) => user.id)
  @JoinColumn()
  actionBy: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
