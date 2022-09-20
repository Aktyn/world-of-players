import { Module } from '@nestjs/common'

import { UserModule } from './user/user.module'
import { WebSocketModule } from './websocket/websocket.module'

@Module({
  imports: [WebSocketModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
