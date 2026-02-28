import { SetMetadata } from '@nestjs/common';

export const jwtConstants = {
  secret: 'AKU CINTA BPS KAB. BOJONEGORO',
};

export const refreshJwtConstants = {
  secret: 'SEMOGA AKU BISA BEKERJA DI SANA',
};

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
