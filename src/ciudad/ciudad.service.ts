/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {  BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { CiudadEntity } from './ciudad.entity';

@Injectable()
export class CiudadService {
    constructor(
        @InjectRepository(CiudadEntity)
        private readonly ciudadRepository: Repository<CiudadEntity>
    ) {}

    async findAll(): Promise<CiudadEntity[]> {
        return this.ciudadRepository.find({ relations: ["supermercados"]  });
    }
    
    async findOne(id: string): Promise<CiudadEntity> {
        const ciudad: CiudadEntity = await this.ciudadRepository.findOne({where: {id}, relations: {supermercados:true, } ,});
        if(!ciudad)
            throw new BusinessLogicException("La ciudad con el id proporcionado no ha sido encontrada.", BusinessError.NOT_FOUND);

        return ciudad;
    }

    async create(ciudad: CiudadEntity): Promise<CiudadEntity> {
        const paisesList :string[] = ["Argentina","Ecuador", "Paraguay"]
        let bandera =false;
        paisesList.forEach(element => {
            if(ciudad.pais == element )
                bandera =true;
        });
        if (!bandera)
            throw new BusinessLogicException("La ciudad tiene un pais invalido.", BusinessError.NOT_FOUND);
        
        return this.ciudadRepository.save(ciudad);

        
    }

    async update(id: string, ciudad: CiudadEntity): Promise<CiudadEntity> {
        const persistedCiudad: CiudadEntity = await this.ciudadRepository.findOne({where:{id}});
        if (!persistedCiudad)
          throw new BusinessLogicException("La ciudad con el id proporcionado no ha sido encontrada.", BusinessError.NOT_FOUND);
        ciudad.id =id;  

        const paisesList :string[] = ["Argentina","Ecuador", "Paraguay"]
        let bandera =false;
        paisesList.forEach(element => {
            if(ciudad.pais == element )
                bandera =true;
        });
        if (!bandera)
            throw new BusinessLogicException("La ciudad tiene un pais invalido.", BusinessError.NOT_FOUND);

        return this.ciudadRepository.save(ciudad);
    }

    async delete(id: string) {
        const ciudad: CiudadEntity = await this.ciudadRepository.findOne({where:{id}});
        if (!ciudad)
            throw new BusinessLogicException("La ciudad con el id proporcionado no ha sido encontrada.", BusinessError.NOT_FOUND);
        await this.ciudadRepository.remove(ciudad);
    }
}