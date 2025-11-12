import { IsString, IsIn } from 'class-validator';

export class UpdateStatusDto {
  @IsString()
  @IsIn(['aFaire', 'enCours', 'termine', 'platine'])
  status: string;
}