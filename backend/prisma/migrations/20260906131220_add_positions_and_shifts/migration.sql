/*
  Warnings:

  - You are about to drop the column `role` on the `Employee` table. All the data in the column will be lost.

*/

-- CreateTable
CREATE TABLE "Position" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Position_pkey" PRIMARY KEY ("id")
);

INSERT INTO "Position" ("name")
SELECT DISTINCT "role"
FROM "Employee"
WHERE "role" IS NOT NULL
  AND TRIM("role") <> '';



-- CreateTable
CREATE TABLE "Shift" (
    "id" SERIAL NOT NULL,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3) NOT NULL,
    "location" TEXT NOT NULL,
    "positionId" INTEGER NOT NULL,
    "employeeId" INTEGER,

    CONSTRAINT "Shift_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_EmployeeToPosition" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_EmployeeToPosition_AB_pkey" PRIMARY KEY ("A","B")
);

INSERT INTO "_EmployeeToPosition" ("A", "B")
SELECT e."id", p."id"
FROM "Employee" e
JOIN "Position" p
  ON p."name" = e."role";

ALTER TABLE "Employee" DROP COLUMN "role";

-- CreateIndex
CREATE UNIQUE INDEX "Position_name_key" ON "Position"("name");

-- CreateIndex
CREATE INDEX "_EmployeeToPosition_B_index" ON "_EmployeeToPosition"("B");

-- AddForeignKey
ALTER TABLE "Shift" ADD CONSTRAINT "Shift_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "Position"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shift" ADD CONSTRAINT "Shift_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EmployeeToPosition" ADD CONSTRAINT "_EmployeeToPosition_A_fkey" FOREIGN KEY ("A") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EmployeeToPosition" ADD CONSTRAINT "_EmployeeToPosition_B_fkey" FOREIGN KEY ("B") REFERENCES "Position"("id") ON DELETE CASCADE ON UPDATE CASCADE;
