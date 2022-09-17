/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { SupermercadoDto } from './supermercado.dto';
import { SupermercadoEntity } from './supermercado.entity';
import { SupermercadoService } from './supermercado.service';
import { plainToInstance } from 'class-transformer';
@Controller('supermarkets')
@UseInterceptors(BusinessErrorsInterceptor)
export class SupermercadoController {
    constructor(private readonly supermercadoService: SupermercadoService) {}
        
    @Get()
    async findAll() {
        return this.supermercadoService.findAll();
    }

    @Get(':supermercadoId')
    async findOne(@Param('supermercadoId') supermercadoId: string){
        return this.supermercadoService.findOne(supermercadoId);
    }
    @Post()
    async create(@Body() supermercadoDto: SupermercadoDto) {
        const supermercado: SupermercadoEntity = plainToInstance(SupermercadoEntity, supermercadoDto);
        return this.supermercadoService.create(supermercado);
    }
    @Put(':supermercadoId')
    async update(@Param('supermercadoId') supermercadoId: string, @Body() supermercadoDto: SupermercadoDto){
        const supermercado: SupermercadoEntity = plainToInstance(SupermercadoEntity, supermercadoDto);
        return this.supermercadoService.update(supermercadoId, supermercado);
    }
    @Delete(':supermercadoId')
    @HttpCode(204)
    async delete(@Param('supermercadoId') supermercadoId: string){
        return this.supermercadoService.delete(supermercadoId)
    }   

}
