import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Diagnostico } from './diagnostico.entity';

@Injectable()
export class DiagnosticoService {
  constructor(
    @InjectRepository(Diagnostico)
    private readonly diagnosticoRepository: Repository<Diagnostico>,
  ) {}

  async create(diagnostico: Diagnostico): Promise<Diagnostico> {
    if (diagnostico.descripcion.length > 200) {
      throw new BadRequestException(
        'La descripción no puede exceder los 200 caracteres',
      );
    }
    return await this.diagnosticoRepository.save(diagnostico);
  }

  async findOne(id: string): Promise<Diagnostico> {
    return await this.diagnosticoRepository.findOne({ where: { id } });
  }

  async findAll(): Promise<Diagnostico[]> {
    return await this.diagnosticoRepository.find();
  }

  async delete(id: string) {
    await this.diagnosticoRepository.delete(id);
  }
}
