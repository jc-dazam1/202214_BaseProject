/* eslint-disable prettier/prettier */
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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
  @OneToMany(() => CiudadEntity, (ciudad) => ciudad.id)
  ciudades: CiudadEntity[];
}
