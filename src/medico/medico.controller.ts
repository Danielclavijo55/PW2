import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { MedicoService } from './medico.service';
import { Medico } from './medico.entity';

@Controller('medicos')
export class MedicoController {
  constructor(private readonly medicoService: MedicoService) {}

  @Get()
  async findAll() {
    return await this.medicoService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.medicoService.findOne(id);
  }

  @Post()
  async create(@Body() medico: Medico) {
    return await this.medicoService.create(medico);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.medicoService.delete(id);
  }
}
