import { NestExpressApplication } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './controllers/app.module';
import { parse } from 'url';
import { NextServer, NextServerOptions } from 'next/dist/server/next';
require('dotenv').config()

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const port = Number(process.env.PORT ?? 3000);
  const perfix = process.env.PERFIX ?? 'api';
  app.setGlobalPrefix(perfix);

  const clientServerConfig: NextServerOptions = {
    dev: process.env.NODE_ENV !== 'development',
    httpServer: app.getHttpServer(),
    customServer: true,
    minimalMode: true,
    dir: './src/client',
    port,
  };

  const createNextServer = require('next');
  const client: NextServer = createNextServer(clientServerConfig);
  const clientRequestHandler = client.getRequestHandler();
  //await client.prepare();
  app.use(async (req: Request, res: Response, next: Function) => {
    // Be sure to pass `true` as the second argument to `url.parse`.
    // This tells it to parse the query portion of the URL.
    const parsedUrl = parse(req.url, true);
    const { pathname, query } = parsedUrl;
    const apiUrl:RegExp = RegExp(`(?:\/${perfix}\/?)`,'gi');
    if (!apiUrl.test(pathname))
      await clientRequestHandler(req, res, parsedUrl);
    else next();
  });

  await app.listen(port);
  console.log('application lisen to http://localhost:'+port);
}
bootstrap();
