import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { DiagnosticoService } from './diagnostico.service';
import { Diagnostico } from './diagnostico.entity';

@Controller('diagnosticos')
export class DiagnosticoController {
  constructor(private readonly diagnosticoService: DiagnosticoService) {}

  @Get()
  async findAll() {
    return await this.diagnosticoService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.diagnosticoService.findOne(id);
  }

  @Post()
  async create(@Body() diagnostico: Diagnostico) {
    return await this.diagnosticoService.create(diagnostico);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.diagnosticoService.delete(id);
  }
}
