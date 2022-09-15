/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { SupermercadoEntity } from '../supermercado/supermercado.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CiudadEntity, SupermercadoEntity])],
})
export class CiudadSupermercadoModule {}
