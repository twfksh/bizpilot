import { Tool } from '@rekog/mcp-nest';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersTool {
    constructor(private readonly usersService: UsersService) { }

    @Tool({
        name: 'createUser',
        description: 'Create a new user',
    })
    async createUser(createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    @Tool({
        name: 'findAllUsers',
        description: 'Find all users',
    })
    async findAllUsers() {
        return this.usersService.findAll();
    }

    @Tool({
        name: 'findUserById',
        description: 'Find a user by their ID',
    })
    async findUserById(id: string) {
        return this.usersService.findOne(id);
    }

    @Tool({
        name: 'findUserByEmail',
        description: 'Find a user by their email',
    })
    async findUserByEmail(email: string) {
        return this.usersService.findByEmail(email);
    }

    @Tool({
        name: 'updateUser',
        description: 'Update a user',
    })
    async updateUser(id: string, updateUserDto: UpdateUserDto) {
        return this.usersService.update(id, updateUserDto);
    }

    @Tool({
        name: 'removeUser',
        description: 'Remove a user',
    })
    async removeUser(id: string) {
        return this.usersService.remove(id);
    }
}
