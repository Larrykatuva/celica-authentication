import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CLIENT_TYPE } from '../../shared/interfaces/auth.interfaces';

@Entity()
export class App {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  clientId: string;

  @Column()
  clientSecret: string;

  @Column({ enum: CLIENT_TYPE, nullable: true })
  clientType: CLIENT_TYPE;

  @Column({ nullable: true })
  redirectUri: string;

  @Column({ nullable: true })
  logo: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: false })
  acceptLegalTerms: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
