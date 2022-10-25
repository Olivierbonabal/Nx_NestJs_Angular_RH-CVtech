/* eslint-disable @typescript-eslint/no-unused-vars */
import { TimestampEntities } from "../../Generics/timestamp.entities";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "../../user/entities/user.entity";

@Entity('cv')
export class CvEntity extends TimestampEntities {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', length: 50 })
  name: string;

  @Column({ length: 50 })
  firstname: string;

  @Column()
  age: number;

  @Column()
  cin: number;

  @Column()
  job: string;

  @Column()
  path: string;

  //Bidirectionnel dc entity user tu dois avoir une ligne cv(s)
  //+tablo d'option bien pratik
  @ManyToOne(type => UserEntity, (user) => user.cvs, {
    cascade: ['insert', 'update'],
    nullable: true,
    eager: true
   }
  )
  user: UserEntity;
    newCv: Express.User;
}

  /*************************export ds un fold commun + clean (ex: GENERICS)********** */
  // @CreateDateColumn()
  // createdAt: Date;

  // @UpdateDateColumn()
  // updatedAt: Date;

  // //SOFT_Delete
  // @DeleteDateColumn()
  // deletedAt: Date;



