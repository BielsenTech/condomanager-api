import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApartmentService } from './apartment.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('apartments')
@Controller('apartments')
export class ApartmentController {
  constructor(private readonly apartmentService: ApartmentService) {}

  @Get()
  @ApiOperation({ summary: 'Get all apartments' })
  findAll() {
    return this.apartmentService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get apartment by ID' })
  findOne(@Param('id') id: string) {
    return this.apartmentService.findById(id);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new apartment' })
  @ApiResponse({ status: 201, description: 'Apartment successfully created.' })
  create(@Body() createApartmentDto: any) {
    return this.apartmentService.create(createApartmentDto);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update an apartment' })
  update(@Param('id') id: string, @Body() updateApartmentDto: any) {
    return this.apartmentService.update(id, updateApartmentDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete an apartment' })
  remove(@Param('id') id: string) {
    return this.apartmentService.remove(id);
  }
} 