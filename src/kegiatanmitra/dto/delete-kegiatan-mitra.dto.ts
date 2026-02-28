import { IsNotEmpty } from 'class-validator';

export class DeleteKegiatanMitra {
  @IsNotEmpty()
  id: number;
}
