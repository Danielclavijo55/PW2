import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Medico } from './medico/medico.entity';
import { Paciente } from './paciente/paciente.entity';
import { Diagnostico } from './diagnostico/diagnostico.entity';
import { MedicoService } from './medico/medico.service';
import { PacienteService } from './paciente/paciente.service';
import { DiagnosticoService } from './diagnostico/diagnostico.service';
import { MedicoController } from './medico/medico.controller';
import { PacienteController } from './paciente/paciente.controller';
import { DiagnosticoController } from './diagnostico/diagnostico.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'postgres',
      password: 'postgres',
      database: 'parcial2web',
      entities: [Medico, Paciente, Diagnostico],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true,
    }),
    TypeOrmModule.forFeature([Medico, Paciente, Diagnostico]),
  ],
  controllers: [MedicoController, PacienteController, DiagnosticoController],
  providers: [MedicoService, PacienteService, DiagnosticoService],
})
export class AppModule {}
