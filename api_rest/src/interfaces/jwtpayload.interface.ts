import { Types } from 'mongoose';

export interface JwtPayload {
  username: string;
  _id: Types.ObjectId;
}
