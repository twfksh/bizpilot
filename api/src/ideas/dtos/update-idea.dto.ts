import { PartialType } from '@nestjs/mapped-types'; // Or use OmitType from @nestjs/swagger for more control
import { CreateIdeaDto } from './create-idea.dto';

export class UpdateIdeaDto extends PartialType(CreateIdeaDto) { }