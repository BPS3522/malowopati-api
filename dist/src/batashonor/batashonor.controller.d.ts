import { BatashonorService } from './batashonor.service';
export declare class BatashonorController {
    private readonly batasHonorService;
    constructor(batasHonorService: BatashonorService);
    getBatasHonor(): Promise<{
        status_code: number;
        message: string;
        data: {
            id: number;
            nama_posisi: string;
            biaya: number;
            keterangan: string | null;
            flag: number | null;
        }[];
    }>;
}
