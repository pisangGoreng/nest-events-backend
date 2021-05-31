import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule
    // for specified logger level we used
    // ,{
    //   logger: ['error', 'warn', 'debug']
    // }
  );

  /*
    similar like app.use in express.js
    this syntax will check every body in http request with ValidationPipe.
    ValidationPipe will be enable globally
  */
  app.useGlobalPipes(new ValidationPipe())


  await app.listen(3000);
}
bootstrap();
