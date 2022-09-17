/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { SupermercadoEntity } from './supermercado.entity';
import { SupermercadoService } from './supermercado.service';
import { faker } from '@faker-js/faker';
describe('SupermercadoService', () => {
  let service: SupermercadoService;
  let repository: Repository<SupermercadoEntity>;
  let supermercadosList = [];
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SupermercadoService],
    }).compile();

    service = module.get<SupermercadoService>(SupermercadoService);
    repository = module.get<Repository<SupermercadoEntity>>(getRepositoryToken(SupermercadoEntity));
    await seedDatabase();
  });

    const seedDatabase = async () => {
      repository.clear();
      supermercadosList = [];

      for(let i =0; i< 5; i++) {

        const supermercado: SupermercadoEntity = await repository.save({
          nombre: faker.address.cityName(),
          longitud: faker.address.longitude(),
          latitud: faker.address.latitude(),
          pagWeb: faker.internet.url()
        })
        supermercadosList.push(supermercado);
      }
    }

    it('should be defined', () => {
      expect(service).toBeDefined();
    });
    it('findAll debe retornar todos los supermercados', async () =>{
      const supermercado: SupermercadoEntity[] = await service.findAll();
      expect(supermercado).not.toBeNull();
      expect(supermercado).toHaveLength(supermercadosList.length);
    });
    it('findOne debe retornar un supermercado por id', async () => {
      const storedSupermercado: SupermercadoEntity = supermercadosList[0];
      const supermercado: SupermercadoEntity = await service.findOne(storedSupermercado.id);
      expect(supermercado).not.toBeNull;
      expect(supermercado.nombre).toEqual(storedSupermercado.nombre)
    });
    it('findOne lanzar excepcion para un Ciudad invalida', async () => {
      await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "El supermercado con el id proporcionado no ha sido encontrado.")
    });
    it('create debe retornar un supermercado nuevo', async () => {

      const supermercado: SupermercadoEntity = {
        id: "",
        nombre: faker.address.cityName(),
        longitud: faker.address.longitude(),
        latitud: faker.address.latitude(),
        pagWeb: faker.internet.url(),
        ciudades: []
      }
      const newSupermercado: SupermercadoEntity = await service.create(supermercado);
      expect(newSupermercado).not.toBeNull();
      const storedSupermercado:SupermercadoEntity = await service.findOne(newSupermercado.id);
      expect(storedSupermercado).not.toBeNull;
      expect(storedSupermercado.nombre).toEqual(newSupermercado.nombre)
      expect(storedSupermercado.longitud).toEqual(newSupermercado.longitud)
      expect(storedSupermercado.latitud).toEqual(newSupermercado.latitud)
      expect(storedSupermercado.pagWeb).toEqual(newSupermercado.pagWeb)
    });

    it('update debe modificar un supermercado', async () => {
      const supermercado: SupermercadoEntity = supermercadosList[0];
      supermercado.nombre = "New name";
      supermercado.longitud = faker.address.longitude(),
      supermercado.latitud = faker.address.latitude(),
      supermercado.pagWeb= faker.internet.url()
    
      const updatedSupermercado: SupermercadoEntity = await service.update(supermercado.id, supermercado);
      expect(updatedSupermercado).not.toBeNull();
    
      const storedSupermercado: SupermercadoEntity = await repository.findOne({ where: { id: supermercado.id } })
      expect(storedSupermercado).not.toBeNull();
      expect(storedSupermercado.nombre).toEqual(updatedSupermercado.nombre)
      expect(storedSupermercado.longitud).toEqual(updatedSupermercado.longitud)
      expect(storedSupermercado.latitud).toEqual(updatedSupermercado.latitud)
      expect(storedSupermercado.pagWeb).toEqual(updatedSupermercado.pagWeb)
    });

    it('update deberia mostrar excepcion para una ciudad no valida', async () => {
      let supermercado: SupermercadoEntity = supermercadosList[0];
      supermercado = {
        ...supermercado, nombre: "New name", longitud: faker.address.longitude(), latitud: "0"
      }
      expect(() => service.update("0", supermercado)).rejects.toHaveProperty("message", "El supermercado con el id proporcionado no ha sido encontrado.")
    });

    it('delete deberia remover un Supermercado', async () => {
      const supermercado: SupermercadoEntity = supermercadosList[0];
      await service.delete(supermercado.id);
    
      const deletedSupermercado: SupermercadoEntity = await repository.findOne({ where: { id: supermercado.id } })
      expect(deletedSupermercado).toBeNull();
    });
  
    it('delete deberia mostrar excepcion para un Supermercado no valida', async () => {
      const supermercado: SupermercadoEntity = supermercadosList[0];
      await service.delete(supermercado.id);
      await expect(() => service.delete("0")).rejects.toHaveProperty("message", "El supermercado con el id proporcionado no ha sido encontrado.")
    });
    
});
