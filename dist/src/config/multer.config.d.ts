export declare const multerConfig: {
    storage: import("multer").StorageEngine;
    fileFilter: (req: any, file: any, callback: any) => void;
    limits: {
        fileSize: number;
    };
};
