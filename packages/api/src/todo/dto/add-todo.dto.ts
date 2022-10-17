import { IsString, IsNotEmpty, MinLength, MaxLength } from "class-validator";

export class AddTodoDto 
{
    @IsString()
    @IsNotEmpty()
    @MaxLength(25)
    @MinLength(6, {
        message: "La taille minimale du champ est de 6 caracteres"
    })
    name: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(10)
    description: string;

}