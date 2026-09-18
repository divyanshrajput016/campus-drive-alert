import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

let appInstance: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });
  return app;
}

// Export default handler for Vercel Serverless Function
export default async function handler(req: any, res: any) {
  if (!appInstance) {
    const app = await bootstrap();
    await app.init();
    appInstance = app.getHttpAdapter().getInstance();
  }
  return appInstance(req, res);
}

// For local development
if (!process.env.VERCEL) {
  const app = await bootstrap();
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Server is running on http://localhost:${port}`);
}
