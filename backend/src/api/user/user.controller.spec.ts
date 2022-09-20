import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'

import { DependencyPrismaModule } from '../../db/dependency-prisma.module'
import { EmailModule } from '../email/email.module'
import { DependencySessionModule } from '../session/dependency-session.module'

import { UserController } from './user.controller'
import { UserService } from './user.service'

describe('UserController', () => {
  let controller: UserController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [EmailModule, DependencySessionModule, DependencyPrismaModule],
      controllers: [UserController],
      providers: [UserService],
    }).compile()

    controller = module.get<UserController>(UserController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
