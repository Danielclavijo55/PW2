import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PacienteService } from './paciente.service';
import { Paciente } from './paciente.entity';
import { Medico } from '../medico/medico.entity';
import { BadRequestException } from '@nestjs/common';

describe('PacienteService', () => {
  let service: PacienteService;
  let pacienteRepository: Repository<Paciente>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PacienteService,
        {
          provide: getRepositoryToken(Paciente),
          useValue: {
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Medico),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PacienteService>(PacienteService);
    pacienteRepository = module.get<Repository<Paciente>>(
      getRepositoryToken(Paciente),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('debería crear un paciente correctamente', async () => {
      const paciente = new Paciente();
      paciente.nombre = 'Juan Perez';
      paciente.genero = 'M';

      jest
        .spyOn(pacienteRepository, 'save')
        .mockResolvedValue(paciente as Paciente);

      const result = await service.create(paciente);
      expect(result).toEqual(paciente);
      expect(pacienteRepository.save).toHaveBeenCalledWith(paciente);
    });

    it('debería fallar al crear un paciente con nombre menor a 3 caracteres', async () => {
      const paciente = new Paciente();
      paciente.nombre = 'Ju';
      paciente.genero = 'M';

      await expect(service.create(paciente)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.create(paciente)).rejects.toThrow(
        'El nombre debe tener al menos 3 caracteres',
      );
      expect(pacienteRepository.save).not.toHaveBeenCalled();
    });
  });
});
