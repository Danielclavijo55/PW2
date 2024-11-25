import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { PacienteService } from './paciente.service';
import { Paciente } from './paciente.entity';

@Controller('pacientes')
export class PacienteController {
  constructor(private readonly pacienteService: PacienteService) {}

  @Get()
  async findAll() {
    return await this.pacienteService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.pacienteService.findOne(id);
  }

  @Post()
  async create(@Body() paciente: Paciente) {
    return await this.pacienteService.create(paciente);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.pacienteService.delete(id);
  }

  @Post(':pacienteId/medicos/:medicoId')
  async addMedicoToPaciente(
    @Param('pacienteId') pacienteId: string,
    @Param('medicoId') medicoId: string,
  ) {
    return await this.pacienteService.addMedicoToPaciente(pacienteId, medicoId);
  }
}
