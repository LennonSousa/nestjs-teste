import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { IGetStatisticsResponse } from '@shared/interfaces/IGetStatistics';
import { Server } from 'socket.io';

@WebSocketGateway(3001, {
  namespace: 'statistics',
  cors: {
    origin: '*',
  },
})
export class TransactionGateway {
  @WebSocketServer() server: Server;

  sendStatistics(statistics: IGetStatisticsResponse) {
    this.server.emit('statistics', statistics);
  }
}
