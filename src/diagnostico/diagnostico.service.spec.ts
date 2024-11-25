import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DiagnosticoService } from './diagnostico.service';
import { Diagnostico } from './diagnostico.entity';
import { BadRequestException } from '@nestjs/common';

describe('DiagnosticoService', () => {
  let service: DiagnosticoService;
  let repository: Repository<Diagnostico>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DiagnosticoService,
        {
          provide: getRepositoryToken(Diagnostico),
          useValue: {
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<DiagnosticoService>(DiagnosticoService);
    repository = module.get<Repository<Diagnostico>>(
      getRepositoryToken(Diagnostico),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('debería crear un diagnóstico correctamente', async () => {
      const diagnostico = new Diagnostico();
      diagnostico.nombre = 'Gripe';
      diagnostico.descripcion = 'Diagnóstico de gripe común';

      jest
        .spyOn(repository, 'save')
        .mockResolvedValue(diagnostico as Diagnostico);

      const result = await service.create(diagnostico);
      expect(result).toEqual(diagnostico);
      expect(repository.save).toHaveBeenCalledWith(diagnostico);
    });

    it('debería fallar al crear un diagnóstico con descripción muy larga', async () => {
      const diagnostico = new Diagnostico();
      diagnostico.nombre = 'Gripe';
      diagnostico.descripcion = 'a'.repeat(201); // 201 caracteres

      await expect(service.create(diagnostico)).rejects.toThrow(
        BadRequestException,
      );
      expect(repository.save).not.toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('debería encontrar un diagnóstico por ID', async () => {
      const diagnostico = new Diagnostico();
      diagnostico.id = '1';
      diagnostico.nombre = 'Gripe';

      jest.spyOn(repository, 'findOne').mockResolvedValue(diagnostico);

      const result = await service.findOne('1');
      expect(result).toEqual(diagnostico);
    });
  });

  describe('findAll', () => {
    it('debería encontrar todos los diagnósticos', async () => {
      const diagnosticos = [
        { id: '1', nombre: 'Gripe' },
        { id: '2', nombre: 'Diabetes' },
      ];

      jest.spyOn(repository, 'find').mockResolvedValue(diagnosticos as any);

      const result = await service.findAll();
      expect(result).toEqual(diagnosticos);
    });
  });
});
