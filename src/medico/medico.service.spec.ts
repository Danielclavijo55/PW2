import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MedicoService } from './medico.service';
import { Medico } from './medico.entity';
import { BadRequestException } from '@nestjs/common';

describe('MedicoService', () => {
  let service: MedicoService;
  let repository: Repository<Medico>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MedicoService,
        {
          provide: getRepositoryToken(Medico),
          useValue: {
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MedicoService>(MedicoService);
    repository = module.get<Repository<Medico>>(getRepositoryToken(Medico));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('debería crear un médico correctamente', async () => {
      const medico = new Medico();
      medico.nombre = 'Dr. García';
      medico.especialidad = 'Cardiología';
      medico.telefono = '1234567890';

      jest.spyOn(repository, 'save').mockResolvedValue(medico as Medico);

      const result = await service.create(medico);
      expect(result).toEqual(medico);
      expect(repository.save).toHaveBeenCalledWith(medico);
    });

    it('debería fallar al crear un médico sin nombre', async () => {
      const medico = new Medico();
      medico.especialidad = 'Cardiología';
      medico.telefono = '1234567890';

      await expect(service.create(medico)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findOne', () => {
    it('debería encontrar un médico por ID', async () => {
      const medico = new Medico();
      medico.id = '1';
      medico.nombre = 'Dr. García';
      medico.pacientes = [];

      jest.spyOn(repository, 'findOne').mockResolvedValue(medico);

      const result = await service.findOne('1');
      expect(result).toEqual(medico);
    });
  });

  describe('delete', () => {
    it('debería eliminar un médico sin pacientes', async () => {
      const medico = new Medico();
      medico.id = '1';
      medico.pacientes = [];

      jest.spyOn(repository, 'findOne').mockResolvedValue(medico);
      jest.spyOn(repository, 'delete').mockResolvedValue(undefined);

      await service.delete('1');
      expect(repository.delete).toHaveBeenCalledWith('1');
    });

    it('no debería eliminar un médico con pacientes', async () => {
      const medico = new Medico();
      medico.id = '1';
      medico.pacientes = [{ id: '1' }] as any[];

      jest.spyOn(repository, 'findOne').mockResolvedValue(medico);

      await expect(service.delete('1')).rejects.toThrow(BadRequestException);
      expect(repository.delete).not.toHaveBeenCalled();
    });
  });
});
