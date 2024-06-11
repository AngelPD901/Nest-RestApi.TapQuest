import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '../schema/user.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  deleteUserDto,
  createUserDto,
  loguinUserDto,
  updateUserDto,
} from 'src/dto';
import { JwtPayload } from '../interfaces/jwtpayload.interface';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  //Obtener todos los usuarios
  async findAll() {
    const users = await this.userModel
      .find()
      .select('-password')
      .sort({ score: 1 });
    return { userlist: users };
  }

  //Crear un usuario en el sistema
  async create(newUser: createUserDto) {
    const user = await this.userModel
      .findOne({ username: newUser.username })
      .select(['username', 'password', '_id']);
    const { password, ...userData } = newUser;

    if (user) throw new ConflictException('This username is in use');

    const passwordHash = bcrypt.hashSync(password, 10);
    const createdUser = await this.userModel.create({
      ...userData,
      password: passwordHash,
    });

    return {
      createdUser,
      token: this.getJwt({
        _id: createdUser._id,
        username: createdUser.username,
      }),
    };
  }

  //Loguin de un usuario en el sistema(falta resolver q no devuelva el password)
  async loguin(userLoguin: loguinUserDto) {
    const { username, password } = userLoguin;
    const user = await this.userModel
      .findOne({ username: username })
      .select(['username', 'password', '_id']);

    if (!user)
      throw new UnauthorizedException('Credenciales no validas (username)');

    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Credencailes no validas (password)');

    return {
      user,
      token: this.getJwt({ _id: user._id, username: user.username }),
    };
  }

  //Actualizar un User
  async updateUser(updateUser: updateUserDto, id: Types.ObjectId) {
    const user = await this.userModel.findByIdAndUpdate(id, updateUser);

    const newUser = await this.userModel.findById(id).select('-password');

    return newUser;
  }

  //Eliminar un usuario del sistema usando username
  async delete(deleteUser: deleteUserDto) {
    const { username } = deleteUser;
    const { deletedCount } = await this.userModel.deleteOne({
      username: username,
    });
    if (deletedCount === 0)
      throw new BadRequestException(`This name ${username} is not found`);
    return { message: 'eliminado correctamente' };
  }

  //Generar JWT basandonos en JwtPaylod
  getJwt(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  /*
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async signIn(
    username: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.findOne(username);
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.userId, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
  */
}
