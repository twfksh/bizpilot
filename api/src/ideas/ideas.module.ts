import { Module } from '@nestjs/common';

import { IdeasService } from './ideas.service';
import { IdeasController } from './ideas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Idea } from './entities/idea.entity';
import { IdeaModel } from './entities/idea-model.entity';
import { AuthModule } from '../auth/auth.module';
<<<<<<< Updated upstream
import { AIService } from '../shared/services/ai.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Idea, IdeaModel]), 
    AuthModule, 
    ConfigModule
  ],
  providers: [IdeasService, AIService],
=======
import { IdeasTool } from './ideas.tool';

@Module({
  imports: [TypeOrmModule.forFeature([Idea, IdeaModel]), AuthModule],
  providers: [IdeasService, IdeasTool],
>>>>>>> Stashed changes
  controllers: [IdeasController],
  exports: [IdeasService, IdeasTool],
})
export class IdeasModule { }
