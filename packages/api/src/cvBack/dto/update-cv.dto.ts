import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

export class UpdateCvDto {

    @IsString()
    @IsOptional()
    name: string;

    @IsString()
    @IsOptional()
    firstname: string;

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

    @IsOptional()
    @IsString()
    job: string;

    @IsOptional()
    @IsString()
    path: string;
}
