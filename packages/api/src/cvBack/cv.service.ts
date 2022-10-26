/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CvEntity } from './entities/cv.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ObjectID, Repository } from 'typeorm';
import { AddCvDto } from './dto/Add-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { UserEntity } from '../user/entities/user.entity';
import { UserRoleEnum } from '../enums/user-role.enum';
import { UserService } from '../user/user.service';

@Injectable()
export class CvService {
    // findCvById: any;
    constructor(
        @InjectRepository(CvEntity)
        private cvRepository: Repository<CvEntity>,
        private userService: UserService
    ) {
    }

    async findCvById(id: number, user: UserEntity) {
        const cv = await this.cvRepository.findOne({ where: { id } });
        if (!cv) {
            throw new NotFoundException(`Le document avec l'id ${id} est introuvable`);
        }
        //si je suis admin ou je suis admin mais g pas de user
        if (this.userService.isOwnerOrAdmin(cv, user))
            return cv;
        else
            throw new UnauthorizedException();
    }

    /*=================trouver======================*/

    async getCvs(user: UserEntity): Promise<CvEntity[]> {
        if (user.role === UserRoleEnum.ADMIN)
            return await this.cvRepository.find();
        return await this.cvRepository.find({ user });
    }

    /*==================ajouter======================*/

    async addCv({ cv, user }: { cv: AddCvDto; user: UserEntity; }): Promise<CvEntity> {
        const newCv = this.cvRepository.create(cv);
        newCv.user = user;
        await this.cvRepository.save(newCv);
        return newCv;
    }

    /*==============update=======================*/

    async updateCv(id: number, cv: UpdateCvDto, user: UserEntity): Promise<CvEntity> {
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
        if (this.userService.isOwnerOrAdmin(newCv, user))
            return await this.cvRepository.save(newCv);
        else
            new UnauthorizedException('');
    }

    /*==============Update2nd==(autre tips+precis)===============*/

    updateCv2(updateCriteria: string | number | string[] | Date | ObjectID | number[] | Date[] | ObjectID[] | FindOptionsWhere<CvEntity>, cv: UpdateCvDto) {
        return this.cvRepository.update(updateCriteria, cv);
    }

    /*===================Remove=====================*/

    // async removeCv(id: number): Promise<CvEntity> {
    //     const cvToRemove = await this.findCvById(id);
    //     return await this.cvRepository.remove(cvToRemove);
    // }

    /*===================SOFTDelete===================*/

    async softDeleteCv({ id, user }: { id: number, user: UserEntity; }) {
        const cv = await this.cvRepository.findOne({ id });
        console.log('cv', cv);
        if (!cv) {
            throw new NotFoundException('');
        }
        if (this.userService.isOwnerOrAdmin(cv, user))
            return this.cvRepository.softDelete(id);
        else
            throw new UnauthorizedException('');
    }

    /*===================Recover======================*/

    async restoreCv(id: number, user) {
        const cv = await this.cvRepository.query("select * from cv where id = ?", [id]);
        if (!cv) {
            throw new NotFoundException('');
        }
        if (this.userService.isOwnerOrAdmin(cv, user))
            return this.cvRepository.restore(id);
        else
            throw new UnauthorizedException('');
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
