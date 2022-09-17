/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SupermercadoEntity } from './supermercado.entity';
import { Repository } from 'typeorm';
import {  BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class SupermercadoService {
    constructor(
        @InjectRepository(SupermercadoEntity)
        private readonly supermercadoRepository: Repository<SupermercadoEntity>
    ) {}

    async findAll(): Promise<SupermercadoEntity[]> {
        return this.supermercadoRepository.find({ relations: ["ciudades"]  });
    }

    async findOne(id: string): Promise<SupermercadoEntity> {
        const supermercado: SupermercadoEntity = await this.supermercadoRepository.findOne({where: {id}, relations: ["ciudades"] } );
        if(!supermercado)
            throw new BusinessLogicException("El supermercado con el id proporcionado no ha sido encontrado.", BusinessError.NOT_FOUND);

        return supermercado;
    }
    async create(supermercado: SupermercadoEntity): Promise<SupermercadoEntity> {
        return this.supermercadoRepository.save(supermercado);
    }

    async update(id: string, supermercado: SupermercadoEntity): Promise<SupermercadoEntity> {
        const persistedSupermercado: SupermercadoEntity = await this.supermercadoRepository.findOne({where:{id}});
        if (!persistedSupermercado)
          throw new BusinessLogicException("El supermercado con el id proporcionado no ha sido encontrado.", BusinessError.NOT_FOUND);
        
        supermercado.id =id;  

        return this.supermercadoRepository.save(supermercado);
    }

    async delete(id: string) {
        const supermercado: SupermercadoEntity = await this.supermercadoRepository.findOne({where:{id}});
        if (!supermercado)
            throw new BusinessLogicException("El supermercado con el id proporcionado no ha sido encontrado.", BusinessError.NOT_FOUND);
        await this.supermercadoRepository.remove(supermercado);
    }


}
