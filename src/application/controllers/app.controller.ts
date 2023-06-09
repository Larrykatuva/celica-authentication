import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AppService } from '../services/app.service';
import { ApiTags } from '@nestjs/swagger';
import { AppResponseDto, RegisterAppDto } from '../dto/app.dtos';
import { App } from '../entities/app.entity';
import { DefaultPagination } from '../../shared/interfaces/pagination.interface';
import { ExtractPagination } from '../../shared/decorators/pagination.decorator';
import { DeleteResult } from 'typeorm';
import {
  SharedPaginatedResponse,
  SharedResponse,
} from '../../shared/decorators/response.decorators';
import { SharedQueryExtractor } from '../../shared/decorators/query.decorator';
import { AuthRoles } from '../../shared/decorators/roles.decorators';

@Controller('app')
@AuthRoles()
@ApiTags('APP')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  @SharedResponse(AppResponseDto)
  async registerApp(@Body() app: RegisterAppDto): Promise<App> {
    return await this.appService.createApp(app);
  }

  @Get()
  @SharedPaginatedResponse(AppResponseDto)
  async getAllApps(
    @SharedQueryExtractor() query: any,
    @ExtractPagination() pagination: DefaultPagination,
  ): Promise<[App[], number]> {
    return await this.appService.filterPaginatedApps(pagination, query, {
      relations: ['scopes.scope'],
    });
  }

  @Get(':id')
  @SharedResponse(AppResponseDto, 200)
  async getAppById(@Param('id') id: string): Promise<App> {
    const app = await this.appService.filterApp(
      { id: id },
      { relations: ['scopes.scope'] },
    );
    if (!app) throw new NotFoundException();
    return app;
  }

  @Patch(':id')
  @SharedResponse(AppResponseDto, 200)
  async updateAppById(
    @Body() body: RegisterAppDto,
    @Param('id') id: string,
  ): Promise<App> {
    await this.appService.updateApp({ id: id }, { name: body.name });
    const app = await this.appService.filterApp(
      { id: id },
      { relations: ['scopes.scope'] },
    );
    if (!app) throw new NotFoundException();
    return app;
  }

  @Delete(':id')
  @SharedResponse(undefined, 204)
  async deleteApp(@Param() id: string): Promise<DeleteResult> {
    return await this.appService.deleteApp({ id: id });
  }
}
