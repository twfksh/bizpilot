
import { IsString, IsNotEmpty, IsNumber, IsEnum, IsOptional, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProductCategory } from '../entities/idea.entity';

export class CreateIdeaDto {
    @ApiProperty({ description: 'Title of the business idea', example: 'Eco-Friendly Packaging Startup' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ description: 'Detailed description of the idea', example: 'Develop biodegradable packaging solutions for e-commerce businesses.' })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({ description: 'Location for the business', example: 'San Francisco, CA' })
    @IsString()
    @IsNotEmpty()
    location: string;

    @ApiProperty({ description: 'Budget for the idea', example: 50000 })
    @IsNumber()
    @IsNotEmpty()
    budget: number;

    @ApiProperty({ enum: ProductCategory, description: 'Category of the business idea', example: ProductCategory.ECO_FRIENDLY })
    @IsEnum(ProductCategory)
    @IsNotEmpty()
    category: ProductCategory;

    @ApiPropertyOptional({ description: 'Array of image URLs', example: ['uploads/ideas/eco1.jpg', 'uploads/ideas/eco2.jpg'] })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    imageUrls?: string[];

    @ApiPropertyOptional({ description: 'PDF file URL', example: 'uploads/ideas/eco-packaging.pdf' })
    @IsOptional()
    @IsString()
    pdfUrl?: string;

    @ApiPropertyOptional({ description: 'Audio file URL', example: 'uploads/ideas/eco-pitch.mp3' })
    @IsOptional()
    @IsString()
    audioUrl?: string;
}