import { Module } from '@nestjs/common';

import { IdeasService } from './ideas.service';
import { IdeasController } from './ideas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Idea } from './entities/idea.entity';
import { IdeaModel } from './entities/idea-model.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Idea, IdeaModel]), AuthModule],
  providers: [IdeasService],
  controllers: [IdeasController],
  exports: [IdeasService],
})
export class IdeasModule { }
