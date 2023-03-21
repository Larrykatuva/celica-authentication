import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AppService } from '../services/app.service';
import { ApiTags } from '@nestjs/swagger';
import { AppResponseDto, RegisterAppDto } from '../dto/app.dtos';
import { App } from '../entities/app.entity';
import { PaginationInterface } from '../../shared/interfaces/pagination.interface';
import { ExtractPagination } from '../../shared/decorators/pagination.decorator';
import { DeleteResult } from 'typeorm';
import { SharedResponsePipe } from '../../shared/decorators/response.decorators';

@Controller('app')
@ApiTags('APP')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  @SharedResponsePipe(AppResponseDto)
  async registerApp(@Body() app: RegisterAppDto): Promise<App> {
    return await this.appService.createApp(app);
  }

  @Get()
  async getAllApps(
    @ExtractPagination() pagination: PaginationInterface,
  ): Promise<[App[], number]> {
    return await this.appService.filterPaginatedApps(pagination);
  }

  @Get(':id')
  async getAppById(@Param('id') id: string): Promise<App> {
    return await this.appService.filterApp({ id: id });
  }

  @Patch(':id')
  async updateAppById(
    @Body() app: RegisterAppDto,
    @Param('id') id: string,
  ): Promise<App> {
    await this.appService.updateApp({ id: id }, { name: app.name });
    return await this.appService.filterApp({ id: id });
  }

  @Delete(':id')
  async deleteApp(@Param() id: string): Promise<DeleteResult> {
    return await this.appService.deleteApp({ id: id });
  }
}