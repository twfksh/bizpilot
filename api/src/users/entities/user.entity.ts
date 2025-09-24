
import { Idea } from 'src/ideas/entities/idea.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';

export enum UserSubscriptionTier {
  FREE = 'Free',
  PRO = 'Pro',
  ENTERPRISE = 'Enterprise',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  avatar?: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: UserSubscriptionTier, default: UserSubscriptionTier.FREE })
  subscriptionTier: UserSubscriptionTier;

  @OneToMany(() => Idea, idea => idea.user, { onDelete: 'CASCADE' })
  ideas: Idea[];
}
