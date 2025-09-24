import { IsString, IsNotEmpty, IsNumber, IsEnum, IsOptional, IsArray } from 'class-validator';
import { ProductCategory } from '../entities/idea.entity';

export class CreateIdeaDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsNotEmpty()
    location: string;

    @IsNumber()
    @IsNotEmpty()
    budget: number;

    @IsEnum(ProductCategory)
    @IsNotEmpty()
    category: ProductCategory;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    imageUrls?: string[];

    @IsOptional()
    @IsString()
    pdfUrl?: string;

    @IsOptional()
    @IsString()
    audioUrl?: string;
}