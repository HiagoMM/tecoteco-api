import { Module } from '@nestjs/common';
import { EventEmitterGateway } from './app.gateway';
import { AppService } from './app.service';

@Module({
  imports: [],
  providers: [AppService, EventEmitterGateway],
})
export class AppModule {}
