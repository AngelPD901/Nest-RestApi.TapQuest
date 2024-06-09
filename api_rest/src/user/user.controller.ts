import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  createUserDto,
  loguinUserDto,
  deleteUserDto,
  updateUserDto,
} from '../dto/';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/decorators/get-user.decorator';
import { User } from 'src/schema/user.schema';
import { Types } from 'mongoose';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  /*@UseGuards(AuthGuard())*/
  findAll() {
    return this.userService.findAll();
  }

  @Post('register')
  create(@Body() body: createUserDto) {
    return this.userService.create(body);
  }

  @Post('loguin')
  loguin(@Body() body: loguinUserDto) {
    return this.userService.loguin(body);
  }

  @Patch()
  @UseGuards(AuthGuard())
  updateUser(@Body() body: updateUserDto, @GetUser('_id') id: Types.ObjectId) {
    return this.userService.updateUser(body,id);
  }

  @Delete()
  @UseGuards(AuthGuard())
  deleteUser(@Body() body: deleteUserDto) {
    return this.userService.delete(body);
  }
}
