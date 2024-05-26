import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';


@Schema()
export class User {
  @Prop({
    required: true,
    unique: true,
    trim: true,
  })
  username: string;

  @Prop({
    required: true,
    trim: true,
    select: false,
  })
  password: string;

  @Prop({
    default: 0,
  })
  score: number;

  @Prop({
    default: 0,
  })
  level: number;

  @Prop({
    default: 0,
  })
  coins: number;

  @Prop({
    default: true,
  })
  isActive: boolean;

  @Prop({
    default: ['user'],
  })
  rols: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
