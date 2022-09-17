/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { Repository } from 'typeorm';
import { SupermercadoEntity } from '../supermercado/supermercado.entity';
import { CiudadSupermercadoService } from './ciudad-supermercado.service';
import { faker } from '@faker-js/faker';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
describe('CiudadSupermercadoService', () => {
  let service: CiudadSupermercadoService;
  let supermercadoRepository: Repository<SupermercadoEntity>;
  let ciudadRepository: Repository<CiudadEntity>;
  let ciudad: CiudadEntity;
  //let supermercado: SupermercadoEntity;
  let supermercadosList: SupermercadoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CiudadSupermercadoService],
    }).compile();

    service = module.get<CiudadSupermercadoService>(CiudadSupermercadoService);
    supermercadoRepository = module.get<Repository<SupermercadoEntity>>(getRepositoryToken(SupermercadoEntity));
    ciudadRepository = module.get<Repository<CiudadEntity>>(getRepositoryToken(CiudadEntity));
    await seeDatabase();
  });

  const seeDatabase =async () => {
    supermercadoRepository.clear();
    ciudadRepository.clear();
    supermercadosList =[];
    for(let i =0; i< 5; i++) {

      const supermercado: SupermercadoEntity = await supermercadoRepository.save({
        nombre: "Nombre del supermercado " + i,
        longitud: faker.address.longitude(),
        latitud: faker.address.latitude(),
        pagWeb: faker.internet.url()
      })
      supermercadosList.push(supermercado);
    }

     ciudad = await ciudadRepository.save({
      nombre: faker.address.cityName(),
      pais: "Argentina",
      numHab: Math.floor(Math.random() * 10000),
      supermercados: supermercadosList

    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addSupermarketToCity agregar un Supermercado a una Ciudad', async () => {
    const newCiudad: CiudadEntity = await ciudadRepository.save({
      nombre: faker.address.cityName(),
      pais: "Argentina",
      numHab: Math.floor(Math.random() * 10000),
    })
    const newSupermercado: SupermercadoEntity = await supermercadoRepository.save({
      nombre: "Nombre del supermercado ",
      longitud: faker.address.longitude(),
      latitud: faker.address.latitude(),
      pagWeb: faker.internet.url()
    })
    
    const resultado: CiudadEntity = await service.addSupermarketToCity(newCiudad.id, newSupermercado.id);
    expect(resultado.supermercados.length).toBe(1);
    expect(resultado.supermercados[0]).not.toBeNull();
    expect(resultado.supermercados[0].nombre).toBe(newSupermercado.nombre);
    expect(resultado.supermercados[0].longitud).toBe(newSupermercado.longitud);
    expect(resultado.supermercados[0].latitud).toBe(newSupermercado.latitud);
    expect(resultado.supermercados[0].pagWeb).toBe(newSupermercado.pagWeb);
  });

  it('addSupermarketToCity debe producir una excepcion para un supermercado invalido', async () => {
    const newCiudad: CiudadEntity = await ciudadRepository.save({
      id: "",
      nombre: faker.address.cityName(),
      pais: "Argentina",
      numHab: Math.floor(Math.random() * 10000),
      supermercados:[]
    })
  
    await expect(() => service.addSupermarketToCity(newCiudad.id, "0")).rejects.toHaveProperty("message", "El supermercado con el id proporcionado no ha sido encontrado.");
  });

  it('addSupermarketToCity debe producir una excepcion para una ciudad invalida', async () => {
    const newSupermercado: SupermercadoEntity = await supermercadoRepository.save({
      nombre: "Nombre del supermercado ",
      longitud: faker.address.longitude(),
      latitud: faker.address.latitude(),
      pagWeb: faker.internet.url()

  })

  await expect (() => service.addSupermarketToCity("0", newSupermercado.id)).rejects.toHaveProperty("message", "La ciudad con el id proporcionado no ha sido encontrada.");
  });
  it('findSupermercadoByCiudadIdSupermercadoId debe retornar un supermercado de una ciudad', async () => {
    const supermercado: SupermercadoEntity = supermercadosList[0];
    const storedSupermercado: SupermercadoEntity = await service.findSupermarketFromCity(ciudad.id, supermercado.id, )
    expect(storedSupermercado).not.toBeNull();
    expect(storedSupermercado.nombre).toBe(supermercado.nombre);
    expect(storedSupermercado.latitud).toBe(supermercado.latitud);
    expect(storedSupermercado.longitud).toBe(supermercado.longitud);
    expect(storedSupermercado.pagWeb).toBe(supermercado.pagWeb);
  });

  it('findSupermercadoByCiudadIdSupermercadoId debe arrojar una excepcion para un supermercado invalido', async () => {
    await expect(()=> service.findSupermarketFromCity(ciudad.id, "0")).rejects.toHaveProperty("message", "El supermercado con el id proporcionado no ha sido encontrado."); 
  });

  it('findSupermercadoByCiudadIdSupermercadoId debe arrojar una excepcion para una ciudad invalida', async () => {
    const supermercado: SupermercadoEntity = supermercadosList[0];
    await expect(()=> service.findSupermarketFromCity("0", supermercado.id)).rejects.toHaveProperty("message", "La ciudad con el id proporcionado no ha sido encontrada."); 
  });

  it('findSupermercadoByCiudadIdSupermercadoId debe arrojar una excepcion para un supermercado no asociado a una ciudad', async () => {
    const newSupermercado: SupermercadoEntity = await supermercadoRepository.save({
      nombre: "Nombre del supermercado ",
      longitud: faker.address.longitude(),
      latitud: faker.address.latitude(),
      pagWeb: faker.internet.url()

  })

    await expect(()=> service.findSupermarketFromCity(ciudad.id, newSupermercado.id)).rejects.toHaveProperty("message", "El supermercado con el id proporcionado no esta asociado a la ciudad."); 
  });
  it('findSupermercadosByCulturaId debe retornar los supermercados de una ciudad', async ()=>{
    const supermercados: SupermercadoEntity[] = await service.findSupermarketsFromCity(ciudad.id);
    expect(supermercados.length).toBe(5)
  });

  it('findSupermercadosByCulturaId debe arrojar una excepcion para una ciudad invalida', async () => {
    await expect(()=> service.findSupermarketsFromCity("0")).rejects.toHaveProperty("message", "La ciudad con el id proporcionado no ha sido encontrada."); 
  });

  
  it('deleteSupermercadoToCiudad debe eliminar un supermercado de una ciudad', async () => {
    const supermercado: SupermercadoEntity = supermercadosList[0];
    
    await service.deleteSupermarketFromCity(ciudad.id, supermercado.id);

    const storedCiudad: CiudadEntity = await ciudadRepository.findOne({where: {id: ciudad.id}, relations: ["supermercados"]});
    const deletedSupermercado: SupermercadoEntity = storedCiudad.supermercados.find(a => a.id === supermercado.id);

    expect(deletedSupermercado).toBeUndefined();

  });

  it('deleteSupermercadoToCiudad debe arrojar una excepcion para un supermercado invalido', async () => {
    await expect(()=> service.deleteSupermarketFromCity(ciudad.id, "0")).rejects.toHaveProperty("message", "El supermercado con el id proporcionado no ha sido encontrado."); 
  });

  it('deleteSupermercadoToCiudad debe arrojar una excepcion para una ciudad invalida', async () => {
    const supermercado: SupermercadoEntity = supermercadosList[0];
    await expect(()=> service.deleteSupermarketFromCity("0", supermercado.id)).rejects.toHaveProperty("message", "La ciudad con el id proporcionado no ha sido encontrada."); 
  });

  it('deleteSupermercadoToCiudad debe arrojar una excepcion para un supermercado no asociado a una ciudad', async () => {
    const newSupermercado: SupermercadoEntity = await supermercadoRepository.save({
      nombre: "Nombre del supermercado ",
      longitud: faker.address.longitude(),
      latitud: faker.address.latitude(),
      pagWeb: faker.internet.url()

    })
    await expect(()=> service.deleteSupermarketFromCity(ciudad.id, newSupermercado.id)).rejects.toHaveProperty("message", "El supermercado con el id proporcionado no esta asociado a la ciudad."); 
  }); 

  it('updateSupermercadosFromCiudad debe actualizar supermercados de una ciudad', async()=>{

    for(let i =0; i< 5; i++) {

      const supermercado: SupermercadoEntity = await supermercadoRepository.save({
        nombre: "Nombre del supermercado " + i,
        longitud: faker.address.longitude(),
        latitud: faker.address.latitude(),
        pagWeb: faker.internet.url()
      })
      supermercadosList.push(supermercado);
    }
    const resultado: CiudadEntity = await service.updateSupermarketsFromCity(ciudad.id, supermercadosList);
    expect(resultado.supermercados.length>5);

  });

  it('updateSupermercadosFromCiudad debe arrojar una excepcion para algun(os) supermercados invalidos', async()=>{

    for(let i =0; i< 5; i++) {

      const supermercado: SupermercadoEntity = await supermercadoRepository.save({
        nombre: "N " + i,
        longitud: faker.address.longitude(),
        latitud: faker.address.latitude(),
        pagWeb: faker.internet.url()
      })
      supermercadosList.push(supermercado);
    }
    await expect(()=> service.updateSupermarketsFromCity(ciudad.id, supermercadosList)).rejects.toHaveProperty("message", "El nombre de algun supermercado es muy corto."); 

  })



});
