/*
  Warnings:

  - A unique constraint covering the columns `[nome]` on the table `Equipamento` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nome]` on the table `Exercicio` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Equipamento_nome_key" ON "Equipamento"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Exercicio_nome_key" ON "Exercicio"("nome");
