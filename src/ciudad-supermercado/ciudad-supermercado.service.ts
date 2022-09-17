/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { SupermercadoEntity } from '../supermercado/supermercado.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class CiudadSupermercadoService {
    constructor(
        @InjectRepository(CiudadEntity)
        private readonly ciudadRepository: Repository<CiudadEntity>,

        @InjectRepository(SupermercadoEntity)
        private readonly supermercadoRepository: Repository<SupermercadoEntity>
    ) {}
    async addSupermarketToCity(ciudadId: string, supermercadoId: string): Promise<CiudadEntity> {
        const supermercado: SupermercadoEntity = await this.supermercadoRepository.findOne({where: {id: supermercadoId}});
        if (!supermercado)
            throw new BusinessLogicException("El supermercado con el id proporcionado no ha sido encontrado.", BusinessError.NOT_FOUND);
        
        const ciudad: CiudadEntity = await this.ciudadRepository.findOne({where: {id: ciudadId}, relations: ["supermercados"]});
        if (!ciudad)
            throw new BusinessLogicException("La ciudad con el id proporcionado no ha sido encontrada.", BusinessError.NOT_FOUND);
         
        ciudad.supermercados = [...ciudad.supermercados, supermercado];
        return this.ciudadRepository.save(ciudad)
    }

    async findSupermarketFromCity(ciudadId: string, supermercadoId: string){
        const supermercado: SupermercadoEntity = await this.supermercadoRepository.findOne({where: {id: supermercadoId}});
        if (!supermercado)
            throw new BusinessLogicException("El supermercado con el id proporcionado no ha sido encontrado.", BusinessError.NOT_FOUND);
        
        const ciudad: CiudadEntity = await this.ciudadRepository.findOne({where: {id: ciudadId}, relations: ["supermercados"]});
        if (!ciudad)
            throw new BusinessLogicException("La ciudad con el id proporcionado no ha sido encontrada.", BusinessError.NOT_FOUND);
        
        const ciudadRestaurante: SupermercadoEntity = ciudad.supermercados.find(e => e.id === supermercado.id)

        if(!ciudadRestaurante)
            throw new BusinessLogicException("El supermercado con el id proporcionado no esta asociado a la ciudad.", BusinessError.PRECONDITION_FAILED)
        
        return ciudadRestaurante;
    }

    async findSupermarketsFromCity(ciudadId: string): Promise<SupermercadoEntity[]> {
        const ciudad: CiudadEntity = await this.ciudadRepository.findOne({where: {id: ciudadId}, relations: ["supermercados"]});
        if (!ciudad)
            throw new BusinessLogicException("La ciudad con el id proporcionado no ha sido encontrada.", BusinessError.NOT_FOUND);
        return ciudad.supermercados;
    }

    async deleteSupermarketFromCity(ciudadId: string, supermercadoId: string) {
        const supermercado: SupermercadoEntity = await this.supermercadoRepository.findOne({where: {id: supermercadoId}});
        if (!supermercado)
            throw new BusinessLogicException("El supermercado con el id proporcionado no ha sido encontrado.", BusinessError.NOT_FOUND);
        
        const ciudad: CiudadEntity = await this.ciudadRepository.findOne({where: {id: ciudadId}, relations: ["supermercados"]});
        if (!ciudad)
            throw new BusinessLogicException("La ciudad con el id proporcionado no ha sido encontrada.", BusinessError.NOT_FOUND);
        
        const ciudadRestaurante: SupermercadoEntity = ciudad.supermercados.find(e => e.id === supermercado.id)


        if(!ciudadRestaurante)
            throw new BusinessLogicException("El supermercado con el id proporcionado no esta asociado a la ciudad.", BusinessError.PRECONDITION_FAILED)
        
        ciudad.supermercados = ciudad.supermercados.filter(e => e.id !== supermercadoId )
        await this.ciudadRepository.save(ciudad)    
    }

   async updateSupermarketsFromCity(ciudadId: string, supermercados:SupermercadoEntity[]): Promise<CiudadEntity> {
        const ciudad: CiudadEntity = await this.ciudadRepository.findOne({where: {id: ciudadId}, relations: ["supermercados"]});
        if (!ciudad)
            throw new BusinessLogicException("La ciudad con el id proporcionado no ha sido encontrada.", BusinessError.NOT_FOUND);

        
        let cumpleLong = true;

        supermercados.forEach(element => {
            if(element.nombre.length<10)
                cumpleLong =false;
        });
        
        if (!cumpleLong)
            throw new BusinessLogicException("El nombre de algun supermercado es muy corto.", BusinessError.PRECONDITION_FAILED);
            
        ciudad.supermercados = supermercados
        return this.ciudadRepository.save(ciudad);
    }

}
