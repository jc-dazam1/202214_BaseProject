/* eslint-disable prettier/prettier */
import {IsNotEmpty, IsString, IsUrl} from 'class-validator';
export class SupermercadoDto {
    @IsString()
    @IsNotEmpty()
    nombre: string;
    @IsString()
    @IsNotEmpty()
    longitud: string;
    @IsString()
    @IsNotEmpty()
    latitud: string;
    @IsUrl()
    @IsNotEmpty()
    pagWeb: string;
}
