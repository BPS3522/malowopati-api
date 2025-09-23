import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class AuthService {
    private usersService;
    private jwtService;
    private prismaService;
    constructor(usersService: UsersService, jwtService: JwtService, prismaService: PrismaService);
    signIn(username: string, pass: string, res: Response): Promise<any>;
    refresh(req: any, res: Response): Promise<{
        access_token: string;
    }>;
    logout(req: any, res: Response): Promise<string>;
}
