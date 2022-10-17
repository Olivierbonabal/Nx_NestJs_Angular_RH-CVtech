import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from "typeorm";

export class TimestampEntities {

    //inaltérable avec false(of course)
    @CreateDateColumn({ update: false })
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    //SOFT_Delete
    @DeleteDateColumn()
    deletedAt?: Date;
}

/******n'oublie pas kom dab EXTENDS!!!!!!!!!!!!!!*** */