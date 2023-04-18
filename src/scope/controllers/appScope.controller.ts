import { ApiTags } from '@nestjs/swagger';
import { Controller } from '@nestjs/common';
import { AppScopeService } from '../services/appScope.service';

@ApiTags('Scope')
@Controller('scope')
export class AppScopeController {
  constructor(private appScopeService: AppScopeService) {}
}
