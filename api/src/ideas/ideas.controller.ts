import { Controller, Get, Post, Patch, Body, Param, Delete, UseGuards, Request, UploadedFiles, UseInterceptors, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
import { IdeasService } from './ideas.service';
import { CreateIdeaDto } from './dtos/create-idea.dto';
import { UpdateIdeaDto } from './dtos/update-idea.dto';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UserSubscriptionTier } from 'src/users/entities/user.entity';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { NotFoundException } from '@nestjs/common';

const multerStorage = diskStorage({
    destination: './uploads/ideas',
    filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        cb(null, `${randomName}${extname(file.originalname)}`);
    },
});

@UseGuards(AuthGuard)
@Controller('ideas')
export class IdeasController {
    constructor(private readonly ideasService: IdeasService) { }

    @Post()
    async create(@Body() createIdeaDto: CreateIdeaDto, @Request() req) {
        return this.ideasService.create(createIdeaDto, req.user);
    }

    @Get()
    async findAll(@Request() req) {
        return this.ideasService.findAllByUser(req.user.id);
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @Request() req) {
        return this.ideasService.findOne(id, req.user.id);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateIdeaDto: UpdateIdeaDto, @Request() req) {
        return this.ideasService.update(id, req.user.id, updateIdeaDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string, @Request() req) {
        return this.ideasService.remove(id, req.user.id);
    }

    @Post(':id/upload-images')
    @UseInterceptors(FilesInterceptor('files', 5, { storage: multerStorage }))
    async uploadImages(
        @Param('id') id: string,
        @UploadedFiles(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }),
                    new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif)$/ }),
                ],
            }),
        ) files: Array<Express.Multer.File>,
        @Request() req,
    ) {
        const imageUrls = files.map(file => `/uploads/ideas/${file.filename}`);
        return this.ideasService.addImageUrls(id, req.user.id, imageUrls);
    }

    @Post(':id/upload-pdf')
    @UseInterceptors(FilesInterceptor('files', 1, { storage: multerStorage }))
    async uploadPdf(
        @Param('id') id: string,
        @UploadedFiles(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10 }),
                    new FileTypeValidator({ fileType: /application\/pdf/ }),
                ],
            }),
        ) files: Array<Express.Multer.File>,
        @Request() req,
    ) {
        if (!files || files.length === 0) {
            throw new Error('No PDF file uploaded.');
        }
        const pdfUrl = `/uploads/ideas/${files[0].filename}`;
        return this.ideasService.addPdfUrl(id, req.user.id, pdfUrl);
    }

    @Post(':id/upload-audio')
    @UseInterceptors(FilesInterceptor('files', 1, { storage: multerStorage }))
    async uploadAudio(
        @Param('id') id: string,
        @UploadedFiles(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10 }),
                    new FileTypeValidator({ fileType: /(mp3|wav|m4a)$/ }),
                ],
            }),
        ) files: Array<Express.Multer.File>,
        @Request() req,
    ) {
        if (!files || files.length === 0) {
            throw new Error('No audio file uploaded.');
        }
        const audioUrl = `/uploads/ideas/${files[0].filename}`;
        return this.ideasService.addAudioUrl(id, req.user.id, audioUrl);
    }

    // --- Dashboard Endpoints (MVP: Placeholder Data) ---
    @Get(':id/dashboard')
    async getDashboard(@Param('id') id: string, @Request() req) {
        return {
            revenueCurve: [1000, 2000, 3000, 4000],
            costPie: [
                { label: 'Production', value: 40 },
                { label: 'Marketing', value: 30 },
                { label: 'R&D', value: 20 },
                { label: 'Other', value: 10 },
            ],
        };
    }

    @Get(':id/models/compare')
    async compareModels(@Param('id') id: string, @Request() req) {
        return {
            models: [
                { id: 'modelA', name: 'Low Cost', revenue: 10000, cost: 7000 },
                { id: 'modelB', name: 'High Growth', revenue: 20000, cost: 15000 },
            ],
            best: 'modelB',
        };
    }

    @Get(':id/models/:modelId/checklist')
    async getChecklist(@Param('id') id: string, @Param('modelId') modelId: string, @Request() req) {
        return {
            checklist: [
                'Register Business',
                'Develop MVP',
                'Market Research',
                'Launch Website',
            ],
        };
    }

    @Patch(':ideaId/models/:modelId/select')
    async selectIdeaModel(
        @Param('ideaId') ideaId: string,
        @Param('modelId') modelId: string,
        @Request() req,
    ) {
        return this.ideasService.selectIdeaModel(ideaId, modelId, req.user.id);
    }

    @Get(':ideaId/models/:modelId/simulations')
    @UseGuards(RolesGuard)
    @Roles(UserSubscriptionTier.PRO, UserSubscriptionTier.ENTERPRISE)
    async getModelSimulations(
        @Param('ideaId') ideaId: string,
        @Param('modelId') modelId: string,
        @Request() req,
    ) {
        const idea = await this.ideasService.findOne(ideaId, req.user.id);
        const model = idea.models.find(m => m.id === modelId);
        if (!model) {
            throw new NotFoundException(`Model with ID "${modelId}" not found for this idea.`);
        }
        return model.visualData;
    }
}