import { Injectable } from '@nestjs/common';
import { User } from './dto/user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService){}

    async findOne(username: string): Promise<User | null>{
        return this.prisma.users.findFirst({
            where:{
                username : username
            }
        })
    }

    async getAll(): Promise<User[] | null>{
        return this.prisma.users.findMany();
    }
}
