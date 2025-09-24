import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity'; // Assuming User entity path
import { IdeaModel } from './idea-model.entity'

export enum ProductCategory {
    ECO_FRIENDLY = 'Eco-Friendly',
    TECH = 'Tech',
    FOOD_BEVERAGE = 'Food & Beverage',
    FASHION = 'Fashion',
    EDUCATION = 'Education',
    SERVICES = 'Services',
    OTHER = 'Other',
}

@Entity('ideas')
export class Idea {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column({ type: 'text' })
    description: string;

    @Column()
    location: string;

    @Column('decimal', { precision: 10, scale: 2 }) // Budget can be decimal
    budget: number;

    @Column({ type: 'enum', enum: ProductCategory })
    category: ProductCategory;

    @Column({ type: 'jsonb', nullable: true }) // Store an array of image paths/URLs
    imageUrls: string[];

    @Column({ nullable: true }) // Store path/URL to the PDF file
    pdfUrl: string;

    @Column({ nullable: true }) // Store path/URL to the audio file
    audioUrl: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => User, user => user.ideas, { onDelete: 'CASCADE' })
    user: User;

    @Column()
    userId: string; // Foreign key column

    @OneToMany(() => IdeaModel, ideaModel => ideaModel.idea, { cascade: true })
    models: IdeaModel[]; // Relation to IdeaModel
}