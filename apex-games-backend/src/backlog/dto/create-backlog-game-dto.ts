import { IsInt, IsString, IsIn, IsOptional, IsUrl } from 'class-validator';
import { Transform } from 'class-transformer';

export class createBacklogGameDto {
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10)) 
  rawgId: number;

  @IsString()
  title: string;

  @IsUrl()
  @IsOptional()
  image: string; 

  @IsString()
  @IsIn(['aFaire', 'enCours', 'termine', 'platine'])
  @IsOptional()
  status: string;
}