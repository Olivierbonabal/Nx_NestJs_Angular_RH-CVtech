import { Injectable, NotFoundException } from '@nestjs/common';
import { CvEntity } from './entities/cv.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ObjectID, Repository } from 'typeorm';
import { AddCvDto } from './dto/Add-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { UserEntity } from '../user/entities/user.entity';
import { User } from '../decorator/user.decorator';
import { UserRoleEnum } from '../enums/user-role.enum';

@Injectable()
export class CvService {
    // findCvById: any;
    constructor(
        @InjectRepository(CvEntity)
        private cvRepository: Repository<CvEntity>
    ) {
    }

    async findCvById(id: number, user) {
        const cv = await this.cvRepository.findOne({ where: { id } });
        if (!cv) {
            throw new NotFoundException(`Le document avec l'id ${id} est introuvable`);
        }
        if(user.role === UserRoleEnum.ADMIN)
        return cv;
    }

    /*=================trouver======================*/

    async getCvs(user: UserEntity): Promise<CvEntity[]> {
        if (user.role === UserRoleEnum.ADMIN)
            return await this.cvRepository.find();
            return await this.cvRepository.find({ user });
    }

    /*============ajouter======================*/

    async addCv(cv: AddCvDto, user): Promise<CvEntity> {
        const newCv = this.cvRepository.create(cv);
        newCv.user = user;
        await this.cvRepository.save(newCv);
    }

    /*==============update=======================*/

    async updateCv(id: number, cv: UpdateCvDto): Promise<CvEntity> {
        //en preload je recupere le cv id et je remplace les vieilles valeur par newcv(--passé en parametre)
        const newCv = await this.cvRepository.preload({
            id,
            //recupere tt de cv
            ...cv,
        });
        //o k ou le doc(cv) don't existe
        if (!newCv) {
            throw new NotFoundException(`Le document avec l'id ${id} est introuvable`);
        }
        //sauvegarde nouvelle entity
        return await this.cvRepository.save(newCv);
    }

    /*==============Update2nd==(autre tips+precis)===============*/

    updateCv2(updateCriteria, cv: UpdateCvDto) {
        return this.cvRepository.update(updateCriteria, cv);
    }

    /*===================Remove=====================*/

    async removeCv(id: number): Promise<CvEntity> {
        const cvToRemove = await this.findCvById(id);
        return await this.cvRepository.remove(cvToRemove);
    }

    /*===================SOFTDelete===================*/

    async softDeleteCv(id: number) {
        return this.cvRepository.softDelete(id);
    }

    /*===================Recover======================*/

    async restoreCv(id: number) {
        this.cvRepository.restore(id);
    }

    /*==================Delete=======================*/

    async deleteCv(id: number) {
        return await this.cvRepository.delete(id);
    }

    /*==================QUERYBuilder=================*/
    /*===========je vx traiter la qté de docs par tranche age===*/

    // async statCvNbrByAge(maxAge, minAge = 0) {
    //     //je crée le querybuilder
    //     const qb = this.cvRepository.createQueryBuilder('cv');
    //     //add se ke tu vx ds le select
    //     qb.select("cv.age, count(cv.id) as CvQuantity")
    //     // les : pr declar en parametres(declar + secur contre les inj. SQL)
    //         .where("cv.age > :minAge and cv.Age < :maxAge")
    //     //Classik ne fait pas (sinon inj. SQL)
    //         // .where(`cv.age > ${minAge} and cv.Age < ${maxAge}`)
    //         .setParameters({minAge, maxAge})
    //         .groupBy("cv.age");
    //     //pr testing
    //     console.log(qb.getSql());
    //     //comment je les recupr (attention o valeurs de retour(getOne, getRawOne, getMany, getRawMany))
    //     return await qb.getRawMany();
    // }
    async statCvNbrByAge(maxAge: number, minAge = 0) {

        const qb = this.cvRepository.createQueryBuilder('cv');
        qb.select("cv.age, count(cv.id) as CvQuantity")
            .where("cv.age > :minAge and cv.Age < :maxAge")
            .setParameters({ minAge, maxAge })
            .groupBy("cv.age");

        return await qb.getRawMany();
    }
}