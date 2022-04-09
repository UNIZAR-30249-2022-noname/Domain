import { Reserva } from '../Domain/Entities/reserva';
import { ReservaRepository } from '../Domain/ReservaRepository';
import { poolConn } from '../../../Infraestructure/Adapters/pg-connection';
import { Injectable } from '@nestjs/common';
import {Reserve}  from '../Domain/Entities/reserva.entity';
import { DatosReserva, DatosReservaProps } from '../Domain/Entities/datosreserva';
import dataSource from '../../../Config/ormconfig_db';
import { DataSource, DeleteResult, UpdateResult } from 'typeorm';
import * as crypto from 'crypto';
import {initializeDBConnector} from '../../../Infraestructure/Adapters/pg-connection'
import { Espacio, EspacioProps } from '../../Espacio/Domain/Entities/espacio';
import { ShortDomainId } from 'types-ddd';


enum ReservaQueries {
    QUERY_BUSCAR_RESERVA_POR_ID = 'SELECT * FROM reservas WHERE id=$1',
    QUERY_BUSCAR_RESERVAS_POR_ESPACIO = 'SELECT * FROM reservas WHERE space=$1',
    QUERY_BUSCAR_RESERVAS_POR_PERSONA = 'SELECT * FROM reservas WHERE person=$1',
    QUERY_BUSCAR_TODAS_RESERVAS = 'SELECT * FROM reservas',
    QUERY_INTRODUCIR_RESERVA = 'INSERT INTO reservas (space,hourstart,hourend,date,person) VALUES ($1,$2,$3,$4,$5)',
    QUERY_ACTUALIZAR_RESERVA = 'UPDATE reservas SET hourstart=$1,hourend=$2,date=$3 WHERE id=$4',
    QUERY_ELIMINAR_RESERVA = 'DELETE FROM reservas WHERE id=$1',
  }
  

export class ReservaRepoPGImpl implements ReservaRepository {
  //Guarda una objeto reserva, devuelve verdad si ha podido insertar la reserva en la base de datos.
  async guardar(reserva: Reserva): Promise<Reserve> {
    //Inicializar el repositorio para le entidad Reserve
    const DataSrc: DataSource = await initializeDBConnector(dataSource);
    const ReserveRepo = DataSrc.getRepository(Reserve)
    const reserveDTO: Reserve = new Reserve();
    //Agregamos los atributos a nuestro DTO procedentes de la reserva
    reserveDTO.fillReserveWithDomainEntity(reserva);
    await ReserveRepo.save(reserveDTO);
    const reservaHecha: Reserve = await ReserveRepo.findOne({
      where: {
        id: reserveDTO.id,
      },
    });
    return reservaHecha
  }
  async actualizar(
    id: number,
    hourstart: string,
    hourend: string,
    date: string,
  ): Promise<boolean> {
    const DataSrc: DataSource = await initializeDBConnector(dataSource);
    const ReserveRepo = DataSrc.getRepository(Reserve);
    const ReservaActualizada: UpdateResult = await ReserveRepo.update(id, { fecha:date, horaInicio:hourstart, horaFin:hourend });
    console.log(ReservaActualizada)
    
    return true;
  }
  async eliminar(id: number): Promise<boolean> {
    const DataSrc: DataSource = await initializeDBConnector(dataSource);
    const ReserveRepo = DataSrc.getRepository(Reserve);
    const ReservaEliminada: DeleteResult = await ReserveRepo.delete(id);
    console.log(ReservaEliminada);
    
    return true;
  }
  
  async buscarReservaPorId(id: number): Promise<Reserve> {
    const DataSrc: DataSource = await initializeDBConnector(dataSource);
    const ReserveRepo = DataSrc.getRepository(Reserve);
    const ReservaObtenida: Reserve = await ReserveRepo.findOne({
      where: {
        id: id,
      },
    });

    return ReservaObtenida;
  }
  
  async buscarReservasPorEspacio(idEspacio: string): Promise<Reserve[]> {
      const DataSrc: DataSource = await initializeDBConnector(dataSource);
      const ReserveRepo = DataSrc.getRepository(Reserve);
      const ReservasObtenidas: Reserve[] = await ReserveRepo.find({
        where: {
          espacioId: idEspacio,
        },
      });
  
      return ReservasObtenidas;
  }

  async testFind(datosReserva: DatosReservaProps): Promise<Reserve[]>{
    const Datos_Reserva: DatosReserva =
        DatosReserva.createDatosReserva(datosReserva);
    const DataSrc: DataSource = await initializeDBConnector(dataSource);
    const ReserveRepo = DataSrc.getRepository(Reserve)
    const reserva: Reserve = new Reserve();
    const espacioprops: EspacioProps = {
      Id: 'hola',
      Name: 'hola',
      Capacity: 15,
      Building: 'Ada',
      Floor: 'Baja',
      Kind: 'Sanidad',
    };
    reserva.fillReserveWithDomainEntity(new Reserva(ShortDomainId.create(crypto.randomBytes(64).toString('hex')),Datos_Reserva,new Espacio(null,null)))
    //reserva.fecha = datosReserva.fecha;
    //reserva.horaFin = datosReserva.horaFin
    //reserva.horaInicio = datosReserva.horaInicio
    console.log(reserva);
    await ReserveRepo.save(reserva);
    const lreservas: Reserve[] = await ReserveRepo.find();
    return lreservas
  }
}
/*
const Datos_Reserva: DatosReserva =
        DatosReserva.createDatosReserva(datosReserva);
    const ReserveRepo = dataSource.getRepository(Reserve)
    const reserva: Reserve = new Reserve(Datos_Reserva);
    await ReserveRepo.save(reserva);
    const lreservas: Reserve[] = await ReserveRepo.find();
    return lreservas*/