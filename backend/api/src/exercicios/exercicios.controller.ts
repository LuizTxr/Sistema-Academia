import { Controller, Get, Post, Body } from '@nestjs/common';
import { ExerciciosService } from './exercicios.service';
import { CreateExercicioDto } from './dto/create-exercicio.dto';

@Controller('exercicios')
export class ExerciciosController {

    constructor(private readonly exerciciosService: ExerciciosService) { }

    @Get()
    findAll() {
        return this.exerciciosService.findAll();
    }

    @Post()
    create(@Body() data: CreateExercicioDto) {
        return this.exerciciosService.create(data);
    }

}
