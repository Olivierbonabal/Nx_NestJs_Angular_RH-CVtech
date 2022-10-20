import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSubscribeDto } from './dto/user-subscribe.dto';
import { UserEntity } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { LoginCredentialsDto } from './dto/login-credentials.dto';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>
    ) { }

    /*========================INSCRIPTION==================================*/

    async register(userData: UserSubscribeDto): Promise<Partial<UserEntity>> {
        const user = this.userRepository.create({ ...userData });
        user.salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(user.password, user.salt);
        try {
            await this.userRepository.save(user);
        } catch (error) {
            throw new ConflictException("Le username et le password doivent être unique");
        }
        return {
            id: user.id,
            username: user.username,
            email: user.email,
            password: user.password
        };
    }

    // //inscription de l'user(essai(fait un dossier a part kom en symfony))
    // //je recupere lesinfos et je crypt le mdp(bcrypt)
    // async subscribe(userData: UserSubscribeDto): Promise<UserEntity> {
    //     //je recupere
    //     // const {username, password, email} = userData;
    //     //je fais 1 nouvel utilisateur et fetch mo les datas
    //     // const user = new UserEntity();
    //     const user = this.userRepository.create({...userData});
    //     //je cree mon salt & j'apel mon bcrypt
    //     user.salt = await bcrypt.genSalt();
    //     user.password = await bcrypt.hash(user.password, user.salt);
    //     try {
    //         //je sauvegarde l'user
    //         await this.userRepository.save(user); 
    //     } catch (error) {
    //         throw new ConflictException("Le username et le password doivent être unique");
    //     }
    //  //supression des données visible
    //   //delete user.salt;
    //  delete user.password;
    //         return user;
    // }

    /*==============================CONNEXION===============================*/

    async login(credentials: LoginCredentialsDto): Promise<Partial<UserEntity>> {
        const { username, password } = credentials;
        const user = await this.userRepository.createQueryBuilder("user")
            .where("user.username = :username or user.email = :username", { username })
            .getOne();
        if (!user) {
            throw new NotFoundException("username ou mdp incorrect");
        }
        const hashedPassword = await bcrypt.hash(password, user.salt);
        if (hashedPassword === user.password) {
            return {
                username,
                email: user.email,
                role: user.role
            }
        } else {
            throw new NotFoundException("username ou mdp incorrect");
        }
    }

    // //va prendre lescoordonnées de l'user
    // //je te promet de te renvoyer partielement userEntity
    // async login(credentials: LoginCredentialsDto): Promise<Partial<UserEntity>> {
    //     //recup login & mdp
    //     const {username, password} = credentials;
    //     //jme log via le username ou le password
    //     //verifie si ya 1 otre user avec ce login/password (querybuilder)
    //     const user = await this.userRepository.createQueryBuilder("user")
    //      .where("user.username = :username or user.email = :username", {username})
    //      .getOne();
    //      //console.log(user);
    //      //Si NOT user ==> error
    //      if(!user){
    //         throw new NotFoundException("username ou mdp incorrect");
    //      }
    //     //Si OUI ==> mdp correct ? (jle compare avec la bdd)
    //     const hashedPassword = await bcrypt.hash(password, user.salt);
    //     //verifie
    //     if(hashedPassword === user.password){
    //         return {
    //             username,
    //             email: user.email,
    //             role: user.role
    //         }
    //         // si mdp incorrect ==> error
    //     } else {
    //         throw new NotFoundException("username ou mdp incorrect");
    //     }
    // }
}
