-- AlterTable
ALTER TABLE "Category" ADD COLUMN "description" TEXT;
ALTER TABLE "Category" ADD COLUMN "iconName" TEXT DEFAULT 'Smartphone';
ALTER TABLE "Category" ADD COLUMN "gradient" TEXT DEFAULT 'from-blue-500/20 to-cyan-500/20';
ALTER TABLE "Category" ADD COLUMN "sortOrder" INTEGER NOT NULL DEFAULT 0;
