import { Injectable, UnauthorizedException } from '@nestjs/common'
import type { User } from '@prisma/client'
import {
  Config,
  ErrorCode,
  getRandomString,
  pick,
  Repeatable,
} from '@world-of-players/shared'

import { sha256 } from '../../common/crypto'
import { PrismaService } from '../../db/prisma.service'

interface SessionSchema {
  userId: User['id']
  role: User['role']
  accessToken: string
  expiresTimestamp: number
}

@Injectable()
export class SessionService {
  private readonly sessions = new Map<string, SessionSchema>()

  constructor(private prisma: PrismaService) {
    const now = Date.now()

    this.removeExpired()
      .then(() =>
        this.prisma.session.findMany({
          where: {
            expiresTimestamp: {
              gt: now,
            },
          },
          include: {
            user: {
              select: {
                role: true,
              },
            },
          },
        }),
      )
      .then((sessions) => {
        for (const session of sessions) {
          this.sessions.set(session.accessToken, {
            ...pick(session, 'accessToken', 'userId'),
            expiresTimestamp: Number(session.expiresTimestamp),
            role: session.user.role,
          })
        }
      })
      .catch(() => void 0)

    // Remove expired sessions every hour
    new Repeatable(() => this.removeExpired().catch(() => void 0), {
      runImmediately: false,
      frequency: 1000 * 60 * 60,
    })
  }

  private removeExpired() {
    const now = Date.now()

    for (const [key, session] of this.sessions) {
      if (session.expiresTimestamp <= now) {
        this.sessions.delete(key)
      }
    }

    return this.prisma.session
      .deleteMany({
        where: {
          expiresTimestamp: {
            lte: now,
          },
        },
      })
      .then((res) => {
        return res.count
      })
  }

  getSession(accessToken: string) {
    const session = this.sessions.get(accessToken)
    if (!session || session.expiresTimestamp <= Date.now()) {
      if (session) {
        // Remove expired session
        this.sessions.delete(accessToken)
      }
      throw new UnauthorizedException({
        error: ErrorCode.SESSION_NOT_FOUND,
      })
    }

    return session
  }

  createSession(userData: Pick<User, 'id' | 'role'>) {
    const accessToken = sha256(getRandomString(32))
    const expiresTimestamp = Date.now() + Config.LOGIN_SESSION_LIFETIME

    const session: SessionSchema = {
      userId: userData.id,
      role: userData.role,
      accessToken,
      expiresTimestamp,
    }
    this.sessions.set(accessToken, session)

    this.prisma.session
      .create({
        data: {
          userId: session.userId,
          accessToken,
          expiresTimestamp,
        },
      })
      .catch(() => void 0)

    return session
  }
}
