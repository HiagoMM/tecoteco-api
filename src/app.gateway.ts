import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { WebcastPushConnection } from 'tiktok-live-connector';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventEmitterGateway {
  @WebSocketServer()
  server: Server;
  tiktok: any;

  @SubscribeMessage('join')
  async join(@MessageBody() data: any) {
    this.tiktok = new WebcastPushConnection(data.user);
    this.tiktok
      .connect()
      .then((state) => {
        console.info(`Connected to roomId ${state.roomId}`);
      })
      .catch((err) => {
        console.error('Failed to connect', err);
      });
    console.log('salve', data);

    this.tiktok.on('chat', (data) => {
      this.server.emit('chat', data);
    });

    this.tiktok.on('gift', (data) => {
      this.server.emit('gift', data);
    });
    
    const gifts = await this.tiktok.getAvailableGifts();
    return gifts.map((gift) => ({
      id: gift.id,
      image: gift.image.url_list[0],
      name: gift.name,
      price: gift.diamond_count,
    }));
  }
  handleDisconnect(socket) {
    this.tiktok.disconnect();
    console.log('disconnect');
  }
}
