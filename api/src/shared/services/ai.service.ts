import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ProductCategory } from '../../ideas/entities/idea.entity';

export interface BusinessModelRequest {
  title: string;
  description: string;
  category: ProductCategory;
  location: string;
  budget: number;
}

export interface BusinessModel {
  name: string;
  summary: string;
  visualData: {
    revenueCurve: number[];
    costPieChart: {
      startup: number;
      operational: number;
    };
    breakEvenMonths: number;
  };
  taskChecklist: string[];
  roadmap: {
    month: number;
    keyTasks: string[];
    milestones: string[];
  }[];
}

@Injectable()
export class AIService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }
    
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  async generateBusinessModels(request: BusinessModelRequest): Promise<BusinessModel[]> {
    const prompt = this.buildBusinessModelPrompt(request);
    
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Parse the AI response into business models
      return this.parseBusinessModelsResponse(text, request.title);
    } catch (error) {
      console.error('Error generating business models:', error);
      // Fallback to mock data if AI fails
      return this.getFallbackModels(request.title);
    }
  }

  private buildBusinessModelPrompt(request: BusinessModelRequest): string {
    return `
You are a business consultant specializing in startup strategy and business model development. 

Generate 2 distinct business models for the following business idea:

**Business Idea Details:**
- Title: ${request.title}
- Description: ${request.description}
- Category: ${request.category}
- Location: ${request.location}
- Budget: $${request.budget}

**Requirements:**
Please create 2 business models with different approaches:
1. **Conservative/Lean Model**: Lower risk, gradual growth, minimal initial investment
2. **Aggressive/Growth Model**: Higher risk, rapid scaling, higher initial investment

For each model, provide:
1. **Name**: A descriptive name for the model
2. **Summary**: 2-3 sentence summary of the approach
3. **Revenue Projection**: 6 monthly revenue figures (realistic for the budget and category)
4. **Cost Structure**: Startup vs Operational cost percentage split
5. **Break-even Timeline**: Estimated months to break even
6. **Task Checklist**: 4-5 actionable tasks specific to this business idea
7. **6-Month Roadmap**: Monthly key tasks and milestones

**Response Format (JSON):**
{
  "models": [
    {
      "name": "Model name here",
      "summary": "Summary here",
      "revenueCurve": [month1, month2, month3, month4, month5, month6],
      "costPieChart": {"startup": 60, "operational": 40},
      "breakEvenMonths": 5,
      "taskChecklist": ["task1", "task2", "task3", "task4"],
      "roadmap": [
        {"month": 1, "keyTasks": ["task1", "task2"], "milestones": ["milestone1"]},
        {"month": 2, "keyTasks": ["task1", "task2"], "milestones": ["milestone1"]},
        // ... continue for 6 months
      ]
    }
  ]
}

Please make the recommendations specific to the business idea provided, considering the category, location, and budget constraints.
`;
  }

  private parseBusinessModelsResponse(aiResponse: string, ideaTitle: string): BusinessModel[] {
    try {
      // Try to extract JSON from the AI response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.models && Array.isArray(parsed.models)) {
          return parsed.models.map(model => ({
            name: `${ideaTitle} - ${model.name}`,
            summary: model.summary,
            visualData: {
              revenueCurve: model.revenueCurve || [1000, 2000, 3000, 4000, 5000, 6000],
              costPieChart: model.costPieChart || { startup: 60, operational: 40 },
              breakEvenMonths: model.breakEvenMonths || 6
            },
            taskChecklist: model.taskChecklist || ['Define target market', 'Develop MVP', 'Launch marketing'],
            roadmap: model.roadmap || this.generateDefaultRoadmap()
          }));
        }
      }
    } catch (error) {
      console.error('Error parsing AI response:', error);
    }

    // Fallback if parsing fails
    return this.getFallbackModels(ideaTitle);
  }

  private getFallbackModels(ideaTitle: string): BusinessModel[] {
    return [
      {
        name: `${ideaTitle} - Lean Startup Model`,
        summary: 'A conservative approach focused on validation and minimal overhead.',
        visualData: {
          revenueCurve: [800, 1200, 1800, 2500, 3200, 4000],
          costPieChart: { startup: 60, operational: 40 },
          breakEvenMonths: 5
        },
        taskChecklist: [
          'Validate core assumptions with target users',
          'Develop Minimum Viable Product (MVP)',
          'Establish basic online presence',
          'Secure initial customer feedback'
        ],
        roadmap: this.generateDefaultRoadmap()
      },
      {
        name: `${ideaTitle} - Growth-Focused Model`,
        summary: 'An aggressive approach targeting rapid market penetration and scaling.',
        visualData: {
          revenueCurve: [500, 1500, 4000, 7000, 11000, 16000],
          costPieChart: { startup: 75, operational: 25 },
          breakEvenMonths: 4
        },
        taskChecklist: [
          'Conduct extensive market research',
          'Build strong brand identity',
          'Launch targeted marketing campaigns',
          'Identify key strategic partnerships'
        ],
        roadmap: this.generateDefaultRoadmap()
      }
    ];
  }

  private generateDefaultRoadmap() {
    const months = ['Planning & Setup', 'Development', 'Testing & Validation', 'Launch Preparation', 'Market Launch', 'Growth & Optimization'];
    return months.map((phase, index) => ({
      month: index + 1,
      keyTasks: [`Complete ${phase.toLowerCase()} phase`, `Review and adjust strategy`],
      milestones: [`${phase} milestone achieved`]
    }));
  }
}