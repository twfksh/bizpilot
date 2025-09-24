import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Idea, ProductCategory } from './entities/idea.entity';
import { IdeaModel, ModelStatus } from './entities/idea-model.entity';
import { CreateIdeaDto } from './dtos/create-idea.dto'
import { UpdateIdeaDto } from './dtos/update-idea.dto';
import { User } from 'src/users/entities/user.entity';
import { AIService } from '../shared/services/ai.service';

@Injectable()
export class IdeasService {
    constructor(
        @InjectRepository(Idea)
        private ideasRepository: Repository<Idea>,
        @InjectRepository(IdeaModel)
        private ideaModelsRepository: Repository<IdeaModel>,
        private aiService: AIService,
    ) { }


    async addAudioUrl(ideaId: string, userId: string, audioUrl: string): Promise<Idea> {
        const idea = await this.findOne(ideaId, userId);
        idea.audioUrl = audioUrl;
        return this.ideasRepository.save(idea);
    }

    async create(createIdeaDto: CreateIdeaDto, user: User): Promise<Idea> {
        const newIdea = this.ideasRepository.create({
            ...createIdeaDto,
            user: user,
            userId: user.id, // Ensure userId is set
        });

        const savedIdea = await this.ideasRepository.save(newIdea);

        // Generate AI-powered business models
        await this.generateAIModels(savedIdea);

        // Return the idea with the generated models
        return this.findOne(savedIdea.id, user.id);
    }

    async findAllByUser(userId: string): Promise<Idea[]> {
        return this.ideasRepository.find({
            where: { userId },
            relations: ['models'], // Eagerly load models
            order: { createdAt: 'DESC' },
        });
    }

    async findOne(id: string, userId: string): Promise<Idea> {
        const idea = await this.ideasRepository.findOne({
            where: { id, userId },
            relations: ['models'],
        });
        if (!idea) {
            throw new NotFoundException(`Idea with ID "${id}" not found or does not belong to user.`);
        }
        return idea;
    }

    async update(id: string, userId: string, updateIdeaDto: UpdateIdeaDto): Promise<Idea> {
        const idea = await this.findOne(id, userId); // Ensure idea belongs to user
        await this.ideasRepository.update(id, updateIdeaDto);
        return this.findOne(id, userId); // Return the updated idea
    }

    async remove(id: string, userId: string): Promise<void> {
        const result = await this.ideasRepository.delete({ id, userId });
        if (result.affected === 0) {
            throw new NotFoundException(`Idea with ID "${id}" not found or does not belong to user.`);
        }
    }

    // File upload methods
    async addImageUrls(ideaId: string, userId: string, imageUrls: string[]): Promise<Idea> {
        const idea = await this.findOne(ideaId, userId);
        idea.imageUrls = [...(idea.imageUrls || []), ...imageUrls];
        return this.ideasRepository.save(idea);
    }

    async addPdfUrl(ideaId: string, userId: string, pdfUrl: string): Promise<Idea> {
        const idea = await this.findOne(ideaId, userId);
        idea.pdfUrl = pdfUrl;
        return this.ideasRepository.save(idea);
    }

    // --- IdeaModel specific methods ---

    private async generateAIModels(idea: Idea): Promise<void> {
        try {
            // Use AI to generate personalized business models
            const businessModels = await this.aiService.generateBusinessModels({
                title: idea.title,
                description: idea.description,
                category: idea.category,
                location: idea.location,
                budget: idea.budget
            });

            // Create IdeaModel entities from AI response
            const ideaModels = businessModels.map(model =>
                this.ideaModelsRepository.create({
                    name: model.name,
                    summary: model.summary,
                    visualData: model.visualData,
                    taskChecklist: model.taskChecklist,
                    roadmap: model.roadmap,
                    idea: idea,
                    ideaId: idea.id,
                }),
            );

            await this.ideaModelsRepository.save(ideaModels);
        } catch (error) {
            console.error('AI model generation failed, using fallback:', error);
            // Fallback to placeholder models if AI fails
            await this.generatePlaceholderModels(idea);
        }
    }

    private async generatePlaceholderModels(idea: Idea): Promise<void> {
        const modelsData = [
            {
                name: `${idea.title} - Model A: Lean Startup`,
                summary: 'A conservative model focused on rapid validation and minimal overhead.',
                visualData: this.generateMockVisualData('lean'),
                taskChecklist: [
                    'Validate core assumptions with target users',
                    'Develop Minimum Viable Product (MVP)',
                    'Establish basic online presence',
                    'Secure initial customer feedback',
                ],
                roadmap: this.generateMockRoadmap(6, 'lean'),
            },
            {
                name: `${idea.title} - Model B: Growth Focused`,
                summary: 'An aggressive model targeting early market penetration and scaling.',
                visualData: this.generateMockVisualData('growth'),
                taskChecklist: [
                    'Conduct extensive market research',
                    'Build strong brand identity',
                    'Launch targeted marketing campaigns',
                    'Identify key strategic partners',
                ],
                roadmap: this.generateMockRoadmap(6, 'growth'),
            },
        ];

        const ideaModels = modelsData.map(data =>
            this.ideaModelsRepository.create({ ...data, idea: idea, ideaId: idea.id }),
        );
        await this.ideaModelsRepository.save(ideaModels);
    }

    // Helper for mock visual data
    private generateMockVisualData(type: string) {
        // For MVP, just return static mock data
        if (type === 'lean') {
            return {
                revenueCurve: [1000, 1500, 2000, 2500, 3000, 3500],
                costPieChart: { startup: 60, operational: 40 },
                breakEvenMonths: 5,
            };
        }
        return {
            revenueCurve: [500, 1200, 3000, 5000, 7000, 9000],
            costPieChart: { startup: 75, operational: 25 },
            breakEvenMonths: 4,
        };
    }

    // Helper for mock roadmap
    private generateMockRoadmap(
        months: number,
        type: string
    ): { month: number; milestones: string[]; keyTasks: string[] }[] {
        const roadmap: { month: number; milestones: string[]; keyTasks: string[] }[] = [];
        for (let i = 1; i <= months; i++) {
            roadmap.push({
                month: i,
                milestones: [`Milestone ${i} for ${type} model`],
                keyTasks: [`Task ${i}.1`, `Task ${i}.2`],
            });
        }
        return roadmap;
    }

    async selectIdeaModel(ideaId: string, modelId: string, userId: string): Promise<IdeaModel> {
        // Ensure the idea and model belong to the user
        const idea = await this.findOne(ideaId, userId);
        const model = await this.ideaModelsRepository.findOne({ where: { id: modelId, ideaId: idea.id } });

        if (!model) {
            throw new NotFoundException(`Idea Model with ID "${modelId}" not found for this idea or user.`);
        }

        // Set other models to DRAFT if a new one is selected
        await this.ideaModelsRepository.createQueryBuilder()
            .update(IdeaModel)
            .set({ status: ModelStatus.DRAFT })
            .where('ideaId = :ideaId', { ideaId: idea.id })
            .andWhere('id != :modelId', { modelId: model.id })
            .execute();

        model.status = ModelStatus.SELECTED;
        return this.ideaModelsRepository.save(model);
    }
}