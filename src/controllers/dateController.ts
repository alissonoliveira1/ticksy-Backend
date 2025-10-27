import { Request, Response } from "express";
import prisma from "../models/prismaClient";
import cloudinary from "../utils/cloudinary";

export const updateUser = async (req: Request, res: Response) => {
     const { uid } = req.params;
     if (!uid) {
        return res.status(400).json({ error: "O ID do usuário (UID) é obrigatório." });
    }
     const { nome, fotoUrl, sobrenome, genero, telefone, data_nascimento } = req.body;

    try {
        const existingUser = await prisma.usuarios.findUnique({
      where: { firebase_uid:uid },
    });
   

    if (!existingUser) {
        return res.status(404).json({ error: "Usuário não encontrado" });
    } 

    const upadteUser = await prisma.usuarios.update({
          where: { firebase_uid:uid },
        data: {
            ...(    nome && { nome }),
            ...(    sobrenome && { sobrenome }),
            ...(    fotoUrl && { fotoUrl }),
            ...(    genero && { genero }),
            ...(    telefone && { telefone }),
            ...(    data_nascimento && { data_nascimento }),
        },

    })
    return res.status(200).json({ message: "Usuário atualizado com sucesso", usuario: upadteUser });
    } catch (error: any) {
        console.error(`Erro ao atualizar usuário com UID ${uid}:`, error);
        return res.status(500).json({ error: "Erro interno ao atualizar usuário." });

}


}

export const updateImg = async (req: Request, res: Response) => {
  const { uid } = req.params;
  if (!uid) {
    return res.status(400).json({ error: "O ID do usuário (UID) é obrigatório." });
  }

  const file = req.file;
  if (!file) {
    return res.status(400).json({ error: "Nenhuma imagem enviada" });
  }

  try {
    // Upload para Cloudinary
    const uploadResult = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "perfil_usuarios",
          resource_type: "image",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      stream.end(file.buffer);
    });

    // Atualiza o banco com a URL da imagem
    const userUpdated = await prisma.usuarios.update({
      where: { firebase_uid: uid },
      data: { foto_perfil: uploadResult.secure_url },
    });

    res.status(200).json({
      message: "Imagem atualizada com sucesso",
      imageUrl: uploadResult.secure_url,
      usuario: userUpdated,
    });
  } catch (error) {
    console.error("Erro ao enviar imagem:", error);
    res.status(500).json({ error: "Erro ao enviar imagem" });
  }
};