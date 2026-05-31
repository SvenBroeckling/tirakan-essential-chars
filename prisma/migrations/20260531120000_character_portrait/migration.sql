ALTER TABLE "Character"
ADD COLUMN "portraitStoragePath" TEXT,
ADD COLUMN "portraitOriginalName" TEXT,
ADD COLUMN "portraitMimeType" TEXT,
ADD COLUMN "portraitSize" INTEGER,
ADD COLUMN "portraitUpdatedAt" TIMESTAMP(3);
