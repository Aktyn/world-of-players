import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'

import { DependencyPrismaModule } from '../../db/dependency-prisma.module'
import { EmailModule } from '../email/email.module'
import { DependencySessionModule } from '../session/dependency-session.module'

import { UserService } from './user.service'

describe('UserService', () => {
  let service: UserService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [EmailModule, DependencySessionModule, DependencyPrismaModule],
      providers: [UserService],
    }).compile()

    service = module.get<UserService>(UserService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
