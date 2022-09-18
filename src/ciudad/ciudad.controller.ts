/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { CiudadDto } from './ciudad.dto';
import { CiudadEntity } from './ciudad.entity';
import { CiudadService } from './ciudad.service';
import { plainToInstance } from 'class-transformer';
@Controller('cities')
@UseInterceptors(BusinessErrorsInterceptor)
export class CiudadController {
    constructor(private readonly ciudadService: CiudadService) {}

    @Get()
    async findAll() {
        return this.ciudadService.findAll();
    }
    @Get(':ciudadId')
    async findOne(@Param('ciudadId') ciudadId: string) {
        return this.ciudadService.findOne(ciudadId);
    }
    @Post()
    async create(@Body() ciudadDto: CiudadDto) {
        const ciudad: CiudadEntity = plainToInstance(CiudadEntity, ciudadDto);
        return this.ciudadService.create(ciudad);
    }
    @Put(':ciudadId')
    async update(@Param('ciudadId') ciudadId: string, @Body() ciudadDto: CiudadDto){
        const ciudad: CiudadEntity = plainToInstance(CiudadEntity, ciudadDto);
        return this.ciudadService.update(ciudadId, ciudad);
    }
    @Delete(':ciudadId')
    @HttpCode(204)
    async delete(@Param('ciudadId') ciudadId: string){
        return this.ciudadService.delete(ciudadId)
    }    

}