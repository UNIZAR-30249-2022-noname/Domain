import { ReservaService } from '../src/Mooc/Reserva/Application/reserva.service';
import { MockReservaRepository } from './mockReservaRepository';
import { EspacioService } from '../src/Mooc/Espacio/Application/usecase/espacio.service';
import { IncidenciaService } from '../src/Mooc/Incidencia/Application/usecase/incidencia.service';
import { EspacioRepoPGImpl } from '../src/Mooc/Espacio/Infraestructure/espacio.repository';
import { IncidenciaRepoPGImpl } from '../src/Mooc/Incidencia/Infraestructure/incidencia.repository';
import { ReservaRepoPGImpl } from '../src/Mooc/Reserva/Infraestructure/reserva.repository';

var providers: any = undefined;
console.log(process.env.MOCKED)
switch (process.env.MOCKED) {
    case "mocked-test":
        providers = [
              {
                provide: 'servicioReservaI',
                useClass: ReservaService,
              },
              {
                provide: 'ReservaRepository',
                useClass: MockReservaRepository,
              },
              {
                provide: 'servicioEspacioI',
                useClass: EspacioService,
              },
              {
                provide: 'servicioIncidenciaI',
                useClass: IncidenciaService,
              },
              {
                provide: 'EspacioRepository',
                useClass: EspacioRepoPGImpl,
              },
              {
                provide: 'IncidenciaRepository',
                useClass: IncidenciaRepoPGImpl,
              }
            ]
        break;
    default:
        providers = [
            {
              provide: 'servicioReservaI',
              useClass: ReservaService,
            },
            {
              provide: 'ReservaRepository',
              useClass: ReservaRepoPGImpl,
            },
            {
              provide: 'servicioEspacioI',
              useClass: EspacioService,
            },
            {
              provide: 'EspacioRepository',
              useClass: EspacioRepoPGImpl,
            },
            {
              provide: 'servicioIncidenciaI',
              useClass: IncidenciaService,
            },
            {
              provide: 'IncidenciaRepository',
              useClass: IncidenciaRepoPGImpl,
            }
          ]
        break;

}

export default providers;