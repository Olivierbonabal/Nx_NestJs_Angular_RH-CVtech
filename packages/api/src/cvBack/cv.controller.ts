import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { CvService } from './cv.service';
import { CvEntity } from './entities/cv.entity';
import { AddCvDto } from './dto/Add-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { JwtAuthGuard } from './../user/Guards/jwt-auth.guard';
import { request } from 'express';
import { User } from "../decorator/user.decorator";
import { UserEntity } from '../user/entities/user.entity';

//je cree une route
@Controller('cv')
export class CvController {

    constructor(private CvService: CvService) { }

    @Get()
    @UseGuards(JwtAuthGuard)
    async getAllCvs(
        // @Request() request: Request
        @User() user: UserEntity
    ): Promise<CvEntity[]> {
        // console.log(request.user);
        return await this.CvService.getCvs(user);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async addCv(
        @Body() addCvDto: AddCvDto,
        // @Request() req: Request
        @User() user: UserEntity
    ): Promise<CvEntity> {
        // const user = request.user;
        // console.log('user extracted from Request', request.user);
        return await this.CvService.addCv(addCvDto, user);
    }

    /*===========================Remove============================*/

    // @Delete(':id')
    // async removeCv(
    //     @Param('id', ParseIntPipe) id: number
    // ) {
    //     return this.CvService.removeCv(id);
    // }

    /*=========================SOFTDelete============================*/

    @Delete(':id')
    async softDeleteCv(
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.CvService.softDeleteCv(id);
    }


    /*===============Chercher le nombre de CV pr tranche d'age=============*/

    // @Get('stats/:max/:min')
    // async statCvNbrByAge(
    //     // @Param("max", ParseIntPipe) max,
    //     // @Param("min", ParseIntPipe) min
    //     // @Body('') statsParams: statParamDTO

    // ) {
    //     return await this.CvService.statCvNbrByAge();
    // }

    @Get('stats')
    async statCvNbrByAge() {
        return await this.CvService.statCvNbrByAge(65, 18);
    }

    /*=========================Recover==========================*/

    @Get('recover/:id')
    @UseGuards(JwtAuthGuard)
    async restoreCv(
        @Param('id', ParseIntPipe) id: number) {
        return await this.CvService.restoreCv(id);
    }

    @Get(":id")
    async getCv(
        @Param("id", ParseIntPipe) id,
        @User() user: UserEntity
    ): Promise<CvEntity> {
        return await this.CvService.findCvById(id, user);
    }

    /*=========================Delete==========================*/

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async deleteCv(
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.CvService.deleteCv(id);
    }

    /*============================================*/

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    async updateCv(
        @Body() updateCvDto: UpdateCvDto,
        @Param('id', ParseIntPipe) id: number,
        @User() user: UserEntity
    ): Promise<CvEntity> {
        return await this.CvService.updateCv(id, updateCvDto);
    }

    /*=======autre methode (+ precis)=======*/
    @Patch()
    @UseGuards(JwtAuthGuard)
    async updateCv2(
        @Body() updateObject,
        @User() user: UserEntity
    ) {
        const { updateCriteria, updateCvDto } = updateObject;
        return await this.CvService.updateCv2(updateCriteria, updateCvDto);
    }
}

function UserError() {
    throw new Error('Function not implemented.');
}
