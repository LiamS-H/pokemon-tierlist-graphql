/*
  Warnings:

  - Made the column `name` on table `Attack` required. This step will fail if there are existing NULL values in that column.
  - Made the column `type` on table `Attack` required. This step will fail if there are existing NULL values in that column.
  - Made the column `number` on table `Pokemon` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `Pokemon` required. This step will fail if there are existing NULL values in that column.
  - Made the column `image` on table `Pokemon` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Attack" ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "type" SET NOT NULL;

-- AlterTable
ALTER TABLE "Pokemon" ALTER COLUMN "number" SET NOT NULL,
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "image" SET NOT NULL;
