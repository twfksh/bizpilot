import { Module } from '@nestjs/common';

import { IdeasService } from './ideas.service';
import { IdeasController } from './ideas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Idea } from './entities/idea.entity';
import { IdeaModel } from './entities/idea-model.entity';
import { AuthModule } from '../auth/auth.module';
import { AIService } from '../shared/services/ai.service';
import { ConfigModule } from '@nestjs/config';
import { IdeasTool } from './ideas.tool';

@Module({
  imports: [
    TypeOrmModule.forFeature([Idea, IdeaModel]),
    AuthModule,
    ConfigModule
  ],
  providers: [IdeasService, AIService, IdeasTool],
  controllers: [IdeasController],
  exports: [IdeasService, IdeasTool],
})
export class IdeasModule { }