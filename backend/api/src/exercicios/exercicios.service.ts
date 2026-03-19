import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExercicioDto } from './dto/create-exercicio.dto';

@Injectable()
export class ExerciciosService {

    constructor(private prisma: PrismaService) { }

    findAll() {
        return this.prisma.exercicio.findMany();
    }

    create(data: CreateExercicioDto) {
        return (this.prisma.exercicio as any).create({
            data: {
                nome: data.nome,
                grupoMuscular: data.grupoMuscular,
                equipamentoId: data.equipamentoId,
            }
        });
    }

}
