ALTER TABLE "Aluno"
ADD COLUMN "matricula" TEXT;

UPDATE "Aluno"
SET "matricula" = LPAD(CAST("id" AS TEXT), 4, '0')
WHERE "matricula" IS NULL;

ALTER TABLE "Aluno"
ALTER COLUMN "matricula" SET NOT NULL;

CREATE UNIQUE INDEX "Aluno_matricula_key" ON "Aluno"("matricula");

ALTER TABLE "Treino"
ADD COLUMN "diaSemana" TEXT;

UPDATE "Treino"
SET "diaSemana" = 'seg'
WHERE "diaSemana" IS NULL;

ALTER TABLE "Treino"
ALTER COLUMN "diaSemana" SET NOT NULL;
