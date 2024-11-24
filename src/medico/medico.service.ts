import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Medico } from './medico.entity';

@Injectable()
export class MedicoService {
  constructor(
    @InjectRepository(Medico)
    private readonly medicoRepository: Repository<Medico>,
  ) {}

  async create(medico: Medico): Promise<Medico> {
    if (!medico.nombre || !medico.especialidad) {
      throw new BadRequestException(
        'El nombre y la especialidad no pueden estar vacíos',
      );
    }
    return await this.medicoRepository.save(medico);
  }

  async findOne(id: string): Promise<Medico> {
    return await this.medicoRepository.findOne({
      where: { id },
      relations: ['pacientes'],
    });
  }

  async findAll(): Promise<Medico[]> {
    return await this.medicoRepository.find();
  }

  async delete(id: string) {
    const medico = await this.findOne(id);
    if (medico.pacientes && medico.pacientes.length > 0) {
      throw new BadRequestException(
        'No se puede eliminar un médico con pacientes asociados',
      );
    }
    await this.medicoRepository.delete(id);
  }
}
