import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersRepository {
  private users: { id: number; username: string; password: string }[] = [];
  private idCounter = 1;

  async findUser(username: string) {
    return this.users.find(user => user.username === username);
  }

  async addUser(username: string, password: string) {
    const newUser = { id: this.idCounter++, username, password };
    this.users.push(newUser);
    return newUser;
  }
}
