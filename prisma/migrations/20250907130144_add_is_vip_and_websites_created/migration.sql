-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "isVip" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "websitesCreated" INTEGER NOT NULL DEFAULT 0;
