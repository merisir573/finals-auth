import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersRepository } from './users.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersRepository: UsersRepository,
  ) {}

  async login(loginDto: { username: string; password: string }) {
    const user = await this.usersRepository.findUser(loginDto.username);

    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { username: user.username, sub: user.id };
    return { access_token: this.jwtService.sign(payload) };
  }

  async register(registerDto: { username: string; password: string }) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    await this.usersRepository.addUser(registerDto.username, hashedPassword);
    return { message: 'User registered successfully' };
  }
}
