/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { SupermercadoDto } from 'src/supermercado/supermercado.dto';
import { SupermercadoEntity } from 'src/supermercado/supermercado.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { CiudadSupermercadoService } from './ciudad-supermercado.service';

@Controller('cities')
@UseInterceptors(BusinessErrorsInterceptor)
export class CiudadSupermercadoController {
    constructor(private readonly ciudadSupermercadoService: CiudadSupermercadoService){}

    @Post(':ciudadId/supermarkets/:supermercadoId')
    async addSupermarketToCity(@Param('ciudadId') ciudadId: string, @Param('supermercadoId') supermercadoId: string): Promise<any>{
       return this.ciudadSupermercadoService.addSupermarketToCity(ciudadId, supermercadoId);
    }

    @Get(':ciudadId/supermarkets')
    async findSupermarketsFromCity(@Param('ciudadId') ciudadId: string){
       return this.ciudadSupermercadoService.findSupermarketsFromCity(ciudadId);
    }

    @Get(':ciudadId/findSupermarketFromCity/:supermercadoId')
    async findProductoByCulturaIdAProductoId(@Param('ciudadId') ciudadId: string, @Param('supermercadoId') supermercadoId: string){
       return this.ciudadSupermercadoService.findSupermarketFromCity(ciudadId, supermercadoId);
    }
    @Put(':ciudadId/supermarkets')
    async updateSupermarketsFromCity(@Body() supermercadosDto: SupermercadoDto[], @Param('ciudadId') ciudadId: string){
       const supermercados = plainToInstance(SupermercadoEntity, supermercadosDto)
       return this.ciudadSupermercadoService.updateSupermarketsFromCity(ciudadId, supermercados);
    }
    @Delete(':ciudadId/supermarkets/:supermercadoId')
    @HttpCode(204)
    async deleteSupermarketFromCity(@Param('ciudadId') ciudadId: string, @Param('supermercadoId') supermercadoId: string){
       return this.ciudadSupermercadoService.deleteSupermarketFromCity(ciudadId, supermercadoId);
    }

}
