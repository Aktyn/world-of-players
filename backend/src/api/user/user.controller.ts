import {
  Body,
  ConflictException,
  Controller,
  Get,
  Patch,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger'
import { int, Config } from '@world-of-players/shared'
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import type { Request as ExpressRequest } from 'express'

import { SuccessResponseClass } from '../../common/common.schema'
import { retrieveAccessToken } from '../../common/rest'

import {
  CreateUserDto,
  EmailConfirmationDto,
  LoginUserDto,
  SetAvatarDto,
  UserPaginatedResponse,
  UserSessionDataClass,
  UserPrivateClass,
} from './user.schema'
import { UserService } from './user.service'

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly service: UserService) {}

  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'pageSize', type: Number, required: false })
  @ApiQuery({ name: 'name', type: String, required: false })
  @ApiQuery({ name: 'nameFragment', type: String, required: false })
  @ApiQuery({ name: 'email', type: String, required: false })
  @ApiQuery({ name: 'emailFragment', type: String, required: false })
  @Get()
  @ApiCreatedResponse({
    type: UserPaginatedResponse,
    description: 'List of users matching given criteria',
  })
  findAll(
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('name') name?: string,
    @Query('nameFragment') nameFragment?: string,
    @Query('email') email?: string,
    @Query('emailFragment') emailFragment?: string,
  ) {
    return this.service.findAll(
      Math.max(0, int(page)),
      int(pageSize) || Config.TABLE.DEFAULT_PAGE_SIZE,
      { name, nameFragment, email, emailFragment },
    )
  }

  @Post('login')
  @ApiCreatedResponse({
    type: UserSessionDataClass,
    description: 'Session data for logged user',
  })
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.service.login(loginUserDto)
  }

  @ApiBearerAuth('Bearer')
  @Get('me')
  @ApiCreatedResponse({
    type: UserPrivateClass,
    description: 'Data of logged user',
  })
  getSelfUserData(@Req() request: ExpressRequest) {
    return this.service.getSelfUser(retrieveAccessToken(request))
  }

  @Post()
  @ApiCreatedResponse({
    type: UserPrivateClass,
    description: 'Created user data',
  })
  create(@Body() createUserDto: CreateUserDto) {
    try {
      return this.service.create(createUserDto)
    } catch (err) {
      if ((err as { code: number }).code === 11000) {
        throw new ConflictException()
      }
      throw err
    }
  }

  @Put('confirm-email')
  @ApiCreatedResponse({
    type: UserSessionDataClass,
    description:
      'Session data since confirming email performs login automatically',
  })
  confirmEmail(@Body() emailConfirmationDto: EmailConfirmationDto) {
    return this.service.confirmEmail(emailConfirmationDto.confirmationCode)
  }

  @ApiBearerAuth('Bearer')
  @Patch('avatar')
  @ApiCreatedResponse({
    type: SuccessResponseClass,
    description: 'Information whether request was successful',
  })
  setAvatar(
    @Body() setAvatarDto: SetAvatarDto,
    @Req() request: ExpressRequest,
  ) {
    return this.service.setAvatar(
      setAvatarDto.base64,
      retrieveAccessToken(request),
    )
  }
}
