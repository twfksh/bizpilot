import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IdeasModule } from './ideas/ideas.module';
import { McpModule, McpTransportType } from '@rekog/mcp-nest';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DB_URL'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get<string>('NODE_ENV') === 'development',
      }),
    }),
    UsersModule,
    AuthModule,
    IdeasModule,
    McpModule.forRoot({
      name: 'bizpilot-mcp',
      version: '0.0.1',
      transport: [McpTransportType.SSE, McpTransportType.STREAMABLE_HTTP],
      sseEndpoint: '/sse',
      messagesEndpoint: '/messages',
      mcpEndpoint: '/mcp',
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
