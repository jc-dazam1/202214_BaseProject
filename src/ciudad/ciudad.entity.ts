/* eslint-disable prettier/prettier */
import { SupermercadoEntity } from '../supermercado/supermercado.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CiudadEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;
  @Column()
  pais: string;
  @Column()
  numHab: number;
  @OneToMany(() => SupermercadoEntity, (supermercados) => supermercados.id)
  supermercados: SupermercadoEntity[];
}
