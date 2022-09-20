import { ApiProperty } from '@nestjs/swagger'
import type { SuccessResponse } from '@world-of-players/shared'

export class SuccessResponseClass implements SuccessResponse {
  @ApiProperty()
  success!: boolean
}
