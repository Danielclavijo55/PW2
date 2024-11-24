import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Paciente } from './paciente.entity';
import { Medico } from '../medico/medico.entity';

@Injectable()
export class PacienteService {
  constructor(
    @InjectRepository(Paciente)
    private readonly pacienteRepository: Repository<Paciente>,
    @InjectRepository(Medico)
    private readonly medicoRepository: Repository<Medico>,
  ) {}

  async create(paciente: Paciente): Promise<Paciente> {
    if (paciente.nombre.length < 3) {
      throw new BadRequestException(
        'El nombre debe tener al menos 3 caracteres',
      );
    }
    return await this.pacienteRepository.save(paciente);
  }

  async findOne(id: string): Promise<Paciente> {
    return await this.pacienteRepository.findOne({
      where: { id },
      relations: ['diagnosticos', 'medicos'],
    });
  }

  async findAll(): Promise<Paciente[]> {
    return await this.pacienteRepository.find();
  }

  async delete(id: string) {
    const paciente = await this.findOne(id);
    if (paciente.diagnosticos && paciente.diagnosticos.length > 0) {
      throw new BadRequestException(
        'No se puede eliminar un paciente con diagnósticos asociados',
      );
    }
    await this.pacienteRepository.delete(id);
  }

  async addMedicoToPaciente(
    pacienteId: string,
    medicoId: string,
  ): Promise<Paciente> {
    const paciente = await this.findOne(pacienteId);
    const medico = await this.medicoRepository.findOne({
      where: { id: medicoId },
    });

    if (!paciente || !medico) {
      throw new BadRequestException('Paciente o médico no encontrado');
    }

    if (paciente.medicos.length >= 5) {
      throw new BadRequestException(
        'Un paciente no puede tener más de 5 médicos asignados',
      );
    }

    paciente.medicos.push(medico);
    return await this.pacienteRepository.save(paciente);
  }
}
