/*
  Warnings:

  - Added the required column `diaSemana` to the `Treino` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Treino" ADD COLUMN     "ativo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "diaSemana" TEXT NOT NULL;
