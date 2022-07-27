import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ReqUser } from 'src/decorators/user.decorator';
import { CardDeleteDTO, CardDTO, CardUpdateDTO } from 'src/dto/card.dto';
import { User } from 'src/types/user';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/add-card')
  @UseGuards(AuthGuard('jwt'))
  async addNewCard(@ReqUser() reqUser: User, @Body() cardDto: CardDTO) {
    return await this.userService.addNewCard(reqUser, cardDto);
  }

  @Get('/view-cards')
  @UseGuards(AuthGuard('jwt'))
  async viewCards(@ReqUser() reqUser: User) {
    return await this.userService.getAllCards(reqUser);
  }

  @Patch('/update-card')
  @UseGuards(AuthGuard('jwt'))
  async updateCard(@ReqUser() reqUser: User, @Body() cardDto: CardUpdateDTO) {
    return await this.userService.updateCard(reqUser, cardDto);
  }

  @Delete('/remove-card')
  @UseGuards(AuthGuard('jwt'))
  async removeCard(@ReqUser() reqUser: User, @Body() cardDto: CardDeleteDTO) {
    return await this.userService.removeCard(reqUser, cardDto);
  }
}
