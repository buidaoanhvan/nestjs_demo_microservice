import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @MessagePattern({ cmd: 'get_users' })
  getUsers(@Payload() data: any, @Ctx() context: RmqContext) {
    const { properties: { headers } } = context.getMessage();
    return headers['x-version'] === '1.0.0' ? '🐱' : '🐈';
  }
}