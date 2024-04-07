import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import envConfig from './config/env.config';
import configureSwagger from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const { port, enableSwagger, frontendHostUrl } = envConfig();

  app.enableCors({ origin: frontendHostUrl });

  if (enableSwagger) {
    configureSwagger(app);
  }

  await app.listen(port);
}
bootstrap();
