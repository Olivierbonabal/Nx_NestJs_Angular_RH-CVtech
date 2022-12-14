import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

export class UpdateCvDto {

    @IsNotEmpty()
    @IsString()
    @IsOptional()
    name: string;

    @IsNotEmpty()
    @IsString()
    @IsOptional()
    firstname: string;

    @IsNotEmpty()
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(16)
    @Max(65)
    age: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    cin: number;

    @IsNotEmpty()
    @IsOptional()
    @IsString()
    job: string;

    
    @IsOptional()
    @IsString()
    path: string;
}
