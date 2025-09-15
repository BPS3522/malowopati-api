import { HonormitraService } from './honormitra.service';
export declare class HonormitraController {
    private readonly honorMitraService;
    constructor(honorMitraService: HonormitraService);
    getHonorMitra(): Promise<{
        status_code: number;
        message: string;
        data: {
            total: number;
            id: number;
            namaLengkap: string;
            sobatId: string;
            januari: number;
            februari: number;
            maret: number;
            april: number;
            mei: number;
            juni: number;
            juli: number;
            agustus: number;
            september: number;
            oktober: number;
            november: number;
            desember: number;
        }[];
    }>;
    getRekapHonorPerBulan(year: string): Promise<{
        status_code: number;
        message: string;
        data: {
            bulan: string;
            total: number;
        }[];
    }>;
}
