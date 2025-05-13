import {
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HealthCheckResponseDTO } from '@shared/dtos/HealthCheckResponseDTO';
import { name, version } from '../../../package.json';

@ApiTags('Health')
@Controller()
export class HealthCheckController {
  @ApiOperation({
    summary: 'Service status',
    description: 'Endpoint to get service status',
  })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: HealthCheckResponseDTO,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: HttpException,
  })
  @Get('/status')
  async healthCheck(): Promise<HealthCheckResponseDTO> {
    return {
      status: 'SERVER_IS_READY',
      name,
      version,
    };
  }
}
