import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { CONSOLE_COLORS } from 'colors.constants';
import { RpcCustomExceptionFilter } from './common';

async function bootstrap() {

  const logger = new Logger(`${CONSOLE_COLORS.TEXT.MAGENTA}Main-Gateway`);

  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalFilters(new RpcCustomExceptionFilter());
  
  await app.listen(envs.port);

  logger.log(`${CONSOLE_COLORS.STYLE.UNDERSCORE}${CONSOLE_COLORS.TEXT.CYAN}Gateway running on ${envs.port}`);
}
bootstrap();
