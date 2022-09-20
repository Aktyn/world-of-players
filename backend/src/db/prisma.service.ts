import type { INestApplication, OnModuleInit } from '@nestjs/common'
import { Injectable } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super()
  }

  async onModuleInit() {
    try {
      await this.$connect()
      // this.logger.log('Connected to database')
    } catch (err) {
      // this.logger.error(err)
    }
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close()
    })
  }
}
