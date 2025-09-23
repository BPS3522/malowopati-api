import { AuthService } from './auth.service';
import type { Response } from 'express';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    signIn(signInDto: Record<string, any>, res: Response): Promise<any>;
    getProfile(req: any): any;
    getRefresh(req: any, res: Response): Promise<{
        access_token: string;
    }>;
    logout(req: any, res: Response): Promise<string>;
}
