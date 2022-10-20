import { IsEmail, IsNotEmpty } from "class-validator";

//je defini ske j'attend d'1 user d'apres mon entity
export class UserSubscribeDto {

    @IsNotEmpty()
    username: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;
    
    @IsNotEmpty()
    password: string;
}