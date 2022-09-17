/* eslint-disable prettier/prettier */
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SupermercadoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;
  @Column()
  longitud: string;
  @Column()
  latitud: string;
  @Column()
  pagWeb: string;
  @ManyToOne(() => CiudadEntity, (ciudades) => ciudades.nombre)
  ciudades: CiudadEntity[];
}
