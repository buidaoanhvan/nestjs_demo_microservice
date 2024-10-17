import { Controller, Get, Inject, Logger, Res } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { RmqRecordBuilder } from '@nestjs/microservices';

@Controller()
export class AppController {

  constructor(@Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy) { }

  @Get()
  async getUsers(@Res() response: Response) {
    const correlationId = uuidv4();

    const builder = new RmqRecordBuilder({ id: correlationId }).setOptions({
      headers: {
        ['x-version']: '1.0.0',
      },
      priority: 3,
    }).build();

    this.userServiceClient
      .send({ cmd: 'get_users' }, builder)
      .subscribe({
        next: (data: any) => {
          response.status(200).json({ id: correlationId, data });
        },
        error: (err: any) => {
          console.log(err);
          response.status(500).json({ error: 'Failed to fetch user data' });
        },
      });
  }
}
