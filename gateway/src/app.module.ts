import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Transport, ClientsModule } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_SERVICE', transport: Transport.RMQ, options: {
          urls: ['amqp://admin:admin@rabbitmq:5672'],
          queue: 'user_queue',
          queueOptions: {
            durable: false
          }
        }
      },
    ])
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
