/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from "typeorm/repository/Repository";
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { CiudadService } from './ciudad.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('CiudadService', () => {
  let service: CiudadService;
  let repository: Repository<CiudadEntity>;
  let ciudadesList = [];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CiudadService],
    }).compile();

    service = module.get<CiudadService>(CiudadService);
    repository = module.get<Repository<CiudadEntity>>(getRepositoryToken(CiudadEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    ciudadesList = [];

    for(let i =0; i< 5; i++) {

      const ciudad: CiudadEntity = await repository.save({
        nombre: faker.address.cityName(),
        pais: "Argentina",
        numHab: Math.floor(Math.random() * 10000)
      })
      ciudadesList.push(ciudad);
    }
  }


  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll debe retornar todos los Ciudades', async () =>{
    const ciudades: CiudadEntity[] = await service.findAll();
    expect(ciudades).not.toBeNull();
    expect(ciudades).toHaveLength(ciudadesList.length);
  });
  it('findOne debe retornar un Ciudad por id', async () => {
    const storedCiudad: CiudadEntity = ciudadesList[0];
    const Ciudad: CiudadEntity = await service.findOne(storedCiudad.id);
    expect(Ciudad).not.toBeNull;
    expect(Ciudad.nombre).toEqual(storedCiudad.nombre)
  });
  it('findOne lanzar excepcion para un Ciudad invalida', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "La ciudad con el id proporcionado no ha sido encontrada.")
  });
  it('create debe retornar una ciudad nueva', async () => {

    const ciudad: CiudadEntity = {
      id: "",
      nombre: faker.address.cityName(),
      pais: "Argentina",
      numHab: Math.floor(Math.random() * 10000),
      supermercados: []
    }
    const newCiudad: CiudadEntity = await service.create(ciudad);
    expect(newCiudad).not.toBeNull();
    const storedCiudad:CiudadEntity = await service.findOne(newCiudad.id);
    expect(storedCiudad).not.toBeNull;
    expect(storedCiudad.nombre).toEqual(newCiudad.nombre)
    expect(storedCiudad.numHab).toEqual(newCiudad.numHab)
    expect(storedCiudad.pais).toEqual(newCiudad.pais)
  });

  it('update debe modificar una ciudad', async () => {
    const ciudad: CiudadEntity = ciudadesList[0];
    ciudad.nombre = "New name";
    ciudad.numHab = 8000;
  
    const updatedCiudad: CiudadEntity = await service.update(ciudad.id, ciudad);
    expect(updatedCiudad).not.toBeNull();
  
    const storedCiudad: CiudadEntity = await repository.findOne({ where: { id: ciudad.id } })
    expect(storedCiudad).not.toBeNull();
    expect(storedCiudad.nombre).toEqual(ciudad.nombre)
    expect(storedCiudad.numHab).toEqual(ciudad.numHab)
  });

    it('update deberia mostrar excepcion para una ciudad no valida', async () => {
      let ciudad: CiudadEntity = ciudadesList[0];
      ciudad = {
        ...ciudad, nombre: "New name", numHab: 58742, pais: "Ecuador"
      }
      expect(() => service.update("0", ciudad)).rejects.toHaveProperty("message", "La ciudad con el id proporcionado no ha sido encontrada.")
    });

    it('delete deberia remover una Ciudad', async () => {
      const ciudad: CiudadEntity = ciudadesList[0];
      await service.delete(ciudad.id);
    
      const deletedCiudad: CiudadEntity = await repository.findOne({ where: { id: ciudad.id } })
      expect(deletedCiudad).toBeNull();
    });
  
    it('delete deberia mostrar excepcion para una ciudad no valida', async () => {
      const ciudad: CiudadEntity = ciudadesList[0];
      await service.delete(ciudad.id);
      await expect(() => service.delete("0")).rejects.toHaveProperty("message", "La ciudad con el id proporcionado no ha sido encontrada.")
    });
    


  });
