import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { App } from '../../application/entities/app.entity';
import { CodePurpose } from '../interfaces/code.interface';

@Entity()
export class Code {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  code: string;

  @OneToOne(() => App, (app) => app.id)
  app: App;

  @Column({ type: 'enum', enum: CodePurpose })
  purpose: string;

  @Column({ default: false })
  used: boolean;

  @Column({ default: false })
  expired: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  UpdatedAt: Date;
}
