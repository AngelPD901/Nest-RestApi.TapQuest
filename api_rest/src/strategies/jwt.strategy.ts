import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../interfaces/jwtpayload.interface';
import { User } from 'src/schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {
    super({
      secretOrKey: process.env.JWT_KEY,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const {_id} = payload;
    const user = await this.userModel.findById(_id);

    if(!user)
        throw new UnauthorizedException('Token not valid');

    if(!user.isActive)
        throw new UnauthorizedException('User is inactivate,talk with admin');

    return user;
  }
}
