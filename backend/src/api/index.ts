import type { INestApplication } from '@nestjs/common'
import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import type { SecuritySchemeObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface'
import { Config } from '@world-of-players/shared'
import { json } from 'express'

import { PrismaService } from '../db/prisma.service'

import { AppModule } from './app.module'

function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('World Of Players REST API')
    // .setDescription('---')
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        schema: 'Bearer',
        bearerFormat: 'Token',
      } as SecuritySchemeObject,
      'Bearer',
    )
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'verbose', 'debug'],
    cors: true,
  })
  app.setGlobalPrefix('/api')
  app.enableCors()
  // Considers base64 conversion which is roughly 8/6 size of original data
  app.use(json({ limit: (Config.MAXIMUM_IMAGE_FILE_SIZE * 8) / 6 + 1024 }))

  setupSwagger(app)

  await app.listen(Config.SERVER_PORT)
  Logger.log(`Application is running on: ${await app.getUrl()}`, 'REST API')

  const prismaService = app.get(PrismaService)
  await prismaService.enableShutdownHooks(app)
}

export function initRestApi() {
  bootstrap()
}
