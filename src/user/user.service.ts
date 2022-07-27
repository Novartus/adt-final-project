import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { User } from 'src/types/user';
import { Payload } from 'src/types/payload';
import { RegisterDTO } from '../dto/register.dto';
import { LoginDTO } from '../dto/login.dto';
import { CardDeleteDTO, CardDTO, CardUpdateDTO } from 'src/dto/card.dto';
import { idMaker } from 'src/helper/idMaker';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async create(RegisterDTO: RegisterDTO) {
    const { email } = RegisterDTO;
    const user = await this.userModel.findOne({ email, deleted_at: null });
    if (user) {
      throw new HttpException(
        'User is already registered',
        HttpStatus.BAD_REQUEST,
      );
    }

    const createdUser = new this.userModel(RegisterDTO);

    await createdUser.save();
    return this.sanitizeUser(createdUser);
  }

  async findByPayload(payload: Payload) {
    const { email } = payload;
    return await this.userModel.findOne({ email, deleted_at: null });
  }

  async findByLogin(UserDTO: LoginDTO) {
    const { email, password } = UserDTO;
    const user = await this.userModel.findOne({ email, deleted_at: null });
    if (!user) {
      throw new HttpException('User does not exists', HttpStatus.BAD_REQUEST);
    }
    if (await bcrypt.compare(password, user.password)) {
      return this.sanitizeUser(user);
    } else {
      throw new HttpException('Invalid credential', HttpStatus.BAD_REQUEST);
    }
  }
  sanitizeUser(user: User) {
    const sanitized = user.toObject();
    delete sanitized['password'];
    return sanitized;
  }

  async addNewCard(reqUser: User, cardDto: CardDTO) {
    const email = reqUser.email;
    const user = await this.userModel.findOne({ email, deleted_at: null });
    if (!user) {
      throw new HttpException('User does not exists', HttpStatus.BAD_REQUEST);
    }
    const newCard = {
      card_id: `card_${idMaker(10)}`,
      card_holder: cardDto.card_holder,
      card_number: cardDto.card_number,
      exp_month: cardDto.exp_month,
      exp_year: cardDto.exp_year,
      cvv: cardDto.cvv,
      deleted_at: null,
    };
    user.card_details.push(newCard);
    await user.save();
    return this.sanitizeUser(user);
  }

  async removeCard(reqUser: User, cardDto: CardDeleteDTO) {
    const email = reqUser.email;
    const user = await this.userModel.findOne({ email, deleted_at: null });
    if (!user) {
      throw new HttpException('User does not exists', HttpStatus.BAD_REQUEST);
    }

    const cardIndex = user.card_details.findIndex((card) => {
      return card.card_id === cardDto.card_id;
    });

    if (cardIndex === -1) {
      throw new HttpException('Card does not exists', HttpStatus.BAD_REQUEST);
    }
    user.card_details[cardIndex].deleted_at = new Date();
    await user.save();
    return this.sanitizeUser(user);
  }

  async updateCard(reqUser: User, cardDto: CardUpdateDTO) {
    const email = reqUser.email;
    const user = await this.userModel.findOne({ email, deleted_at: null });
    if (!user) {
      throw new HttpException('User does not exists', HttpStatus.BAD_REQUEST);
    }
    const cardIndex = user.card_details.findIndex(
      (card) => card.card_id === cardDto.card_id,
    );
    if (cardIndex === -1) {
      throw new HttpException('Card does not exists', HttpStatus.BAD_REQUEST);
    }
    user.card_details[cardIndex].card_holder = cardDto.card_holder
      ? cardDto.card_holder
      : user.card_details[cardIndex].card_holder;
    user.card_details[cardIndex].card_number = cardDto.card_number
      ? cardDto.card_number
      : user.card_details[cardIndex].card_number;
    user.card_details[cardIndex].exp_month = cardDto.exp_month
      ? cardDto.exp_month
      : user.card_details[cardIndex].exp_month;
    user.card_details[cardIndex].exp_year = cardDto.exp_year
      ? cardDto.exp_year
      : user.card_details[cardIndex].exp_year;
    user.card_details[cardIndex].cvv = cardDto.cvv
      ? cardDto.cvv
      : user.card_details[cardIndex].cvv;
    await user.save();
    return user.card_details[cardIndex];
  }

  async getAllCards(reqUser: User) {
    const email = reqUser.email;
    const user = await this.userModel.findOne({ email, deleted_at: null });
    if (!user) {
      throw new HttpException('User does not exists', HttpStatus.BAD_REQUEST);
    }
    const cards = user.card_details;
    return cards;
  }
}
