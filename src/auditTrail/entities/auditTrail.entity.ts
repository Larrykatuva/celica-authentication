import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { App } from '../../application/entities/app.entity';
import { User } from '../../user/entities/user.entity';
import { AppScope } from '../../scope/entities/appScope.entity';
import { Scope } from '../../scope/entities/scope.entity';

@Entity()
export class AuditTrail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => App, (app) => app.id)
  @JoinColumn()
  app: App;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn()
  user: User;

  @ManyToOne(() => AppScope, (appScope) => appScope.id)
  @JoinColumn()
  appScope: AppScope;

  @ManyToOne(() => Scope, (scope) => scope.id)
  @JoinColumn()
  scope: Scope;

  @Column({ type: 'text' })
  description: string;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
