import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Paciente } from '../paciente/paciente.entity';

@Entity()
export class Diagnostico {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  descripcion: string;

  @ManyToMany(() => Paciente, (paciente) => paciente.diagnosticos)
  pacientes: Paciente[];
}
