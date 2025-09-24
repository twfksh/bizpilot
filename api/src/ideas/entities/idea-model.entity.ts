import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Idea } from './idea.entity';

export enum ModelStatus {
  DRAFT = 'Draft',
  SELECTED = 'Selected',
  ARCHIVED = 'Archived',
}

@Entity('idea_models')
export class IdeaModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string; // e.g., "Model A: Low Cost", "Model B: High Growth"

  @Column({ type: 'jsonb' }) // Placeholder for revenue curves, cost pie charts, etc.
  visualData: any; // For MVP, this can be simple JSON mock data

  @Column({ type: 'text' })
  summary: string; // A brief summary of the model

  @Column({ type: 'enum', enum: ModelStatus, default: ModelStatus.DRAFT })
  status: ModelStatus;

  @Column({ type: 'jsonb', nullable: true }) // Auto-generated task checklists (placeholder)
  taskChecklist: string[]; // e.g., ["Register Business", "Develop MVP", "Market Research"]

  @Column({ type: 'jsonb', nullable: true }) // Placeholder for roadmap templates
  roadmap: any; // For MVP, simple JSON

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Idea, idea => idea.models, { onDelete: 'CASCADE' })
  idea: Idea;

  @Column()
  ideaId: string; // Foreign key column
}