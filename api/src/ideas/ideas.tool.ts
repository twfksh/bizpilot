import { Injectable } from "@nestjs/common";
import { Tool } from "@rekog/mcp-nest";
import { IdeasService } from './ideas.service';
import { CreateIdeaDto } from './dtos/create-idea.dto';
import { UpdateIdeaDto } from './dtos/update-idea.dto';

@Injectable()
export class IdeasTool {
    constructor(private readonly ideasService: IdeasService) { }

    @Tool({
        name: 'createIdea',
        description: 'Create a new business idea for a user. Requires CreateIdeaDto and userId.'
    })
    async createIdea(createIdeaDto: CreateIdeaDto, userId: string) {
        // For MCP, userId must be provided explicitly
        return this.ideasService.create(createIdeaDto, { id: userId } as any);
    }

    @Tool({
        name: 'findAllIdeasByUserEmail',
        description: 'Get all business ideas for a specific user by email.'
    })
    async findAllIdeasByUser(email: string) {
        return this.ideasService.findAllByUserEmail(email);
    }

    @Tool({
        name: 'findIdeaById',
        description: 'Get a single business idea by its id and userId.'
    })
    async findIdeaById(id: string, userId: string) {
        return this.ideasService.findOne(id, userId);
    }

    @Tool({
        name: 'updateIdea',
        description: 'Update a business idea by id and userId. Requires UpdateIdeaDto.'
    })
    async updateIdea(id: string, userId: string, updateIdeaDto: UpdateIdeaDto) {
        return this.ideasService.update(id, userId, updateIdeaDto);
    }

    @Tool({
        name: 'removeIdea',
        description: 'Delete a business idea by id and userId.'
    })
    async removeIdea(id: string, userId: string) {
        return this.ideasService.remove(id, userId);
    }

    @Tool({
        name: 'addIdeaImageUrls',
        description: 'Add image URLs to an idea by ideaId and userId.'
    })
    async addIdeaImageUrls(ideaId: string, userId: string, imageUrls: string[]) {
        return this.ideasService.addImageUrls(ideaId, userId, imageUrls);
    }

    @Tool({
        name: 'addIdeaPdfUrl',
        description: 'Add a PDF URL to an idea by ideaId and userId.'
    })
    async addIdeaPdfUrl(ideaId: string, userId: string, pdfUrl: string) {
        return this.ideasService.addPdfUrl(ideaId, userId, pdfUrl);
    }

    @Tool({
        name: 'addIdeaAudioUrl',
        description: 'Add an audio URL to an idea by ideaId and userId.'
    })
    async addIdeaAudioUrl(ideaId: string, userId: string, audioUrl: string) {
        return this.ideasService.addAudioUrl(ideaId, userId, audioUrl);
    }

    @Tool({
        name: 'selectIdeaModel',
        description: 'Select a specific model for an idea by ideaId, modelId, and userId.'
    })
    async selectIdeaModel(ideaId: string, modelId: string, userId: string) {
        return this.ideasService.selectIdeaModel(ideaId, modelId, userId);
    }
}