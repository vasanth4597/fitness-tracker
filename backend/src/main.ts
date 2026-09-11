import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Allow the Vercel frontend URL in production; allow all in dev
  const allowedOrigin = process.env.FRONTEND_URL || true;
  app.enableCors({ origin: allowedOrigin, credentials: true });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
