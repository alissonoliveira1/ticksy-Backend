-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "firebase_uid" TEXT NOT NULL,
    "nome" TEXT,
    "email" TEXT NOT NULL,
    "foto_perfil" TEXT,
    "bio" TEXT,
    "telefone" TEXT,
    "role" TEXT NOT NULL DEFAULT 'user',
    "verificado" BOOLEAN NOT NULL DEFAULT false,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "data_nascimento" TIMESTAMP(3),
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ultimo_login" TIMESTAMP(3),

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organizador" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "nomeEmpresa" TEXT,
    "cnpj" TEXT,
    "cpf" TEXT,
    "site" TEXT,
    "verificado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Organizador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Evento" (
    "id" TEXT NOT NULL,
    "organizadorId" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "categoria" TEXT,
    "local" TEXT,
    "cidade" TEXT,
    "estado" TEXT,
    "dataInicio" TIMESTAMP(3) NOT NULL,
    "dataFim" TIMESTAMP(3) NOT NULL,
    "preco" DECIMAL(10,2) NOT NULL,
    "capacidade" INTEGER NOT NULL,
    "ingressosDisponiveis" INTEGER NOT NULL,
    "banner" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Evento_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_firebase_uid_key" ON "usuarios"("firebase_uid");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Organizador_usuarioId_key" ON "Organizador"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "Organizador_cnpj_key" ON "Organizador"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "Organizador_cpf_key" ON "Organizador"("cpf");

-- AddForeignKey
ALTER TABLE "Organizador" ADD CONSTRAINT "Organizador_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evento" ADD CONSTRAINT "Evento_organizadorId_fkey" FOREIGN KEY ("organizadorId") REFERENCES "Organizador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
