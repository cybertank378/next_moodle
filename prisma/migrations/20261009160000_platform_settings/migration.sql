CREATE TABLE "platform_settings" (
  "id" TEXT NOT NULL DEFAULT 'platform',
  "applicationName" TEXT NOT NULL,
  "applicationShortName" TEXT NOT NULL,
  "applicationDescription" TEXT NOT NULL,
  "supportEmail" TEXT,
  "supportUrl" TEXT,
  "pwaThemeColor" TEXT NOT NULL,
  "pwaBackgroundColor" TEXT NOT NULL,
  "revision" INTEGER NOT NULL DEFAULT 1,
  "updatedById" TEXT,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "platform_settings_pkey" PRIMARY KEY ("id")
);
INSERT INTO "platform_settings" ("id","applicationName","applicationShortName","applicationDescription","pwaThemeColor","pwaBackgroundColor","updatedAt")
VALUES ('platform','Aksaventra','Aksaventra','Platform pembelajaran dan ujian berbasis Moodle untuk sekolah.','#082d61','#ffffff',CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;
