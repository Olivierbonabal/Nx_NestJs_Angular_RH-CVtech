/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { TimestampEntities } from '../../Generics/timestamp.entities';
import { UserRoleEnum } from "../../enums/user-role.enum";
import { CvEntity } from "../../cvBack/entities/cv.entity";

@Entity('user')
export class UserEntity extends TimestampEntities {

    //je cree mon user en bdd
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50, unique: true })
    username: string;

    @Column({ unique: true })
    email: string;

    //Pr l'identifier
    @Column()
    password: string;

    //aide pr crypt mdp
    @Column()
    salt: string;

    //cette prop. s'associe ko elements d'Enums
    @Column({ type: 'enum', enum: UserRoleEnum, default: UserRoleEnum.USER })
    role: string;

    @OneToMany(type => CvEntity, (cv) => cv.user, { nullable: true, cascade: true })
    cvs: CvEntity[];
}