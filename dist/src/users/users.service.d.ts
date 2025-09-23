import { User } from './dto/user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findOne(username: string): Promise<User | null>;
    getAll(): Promise<User[] | null>;
}
