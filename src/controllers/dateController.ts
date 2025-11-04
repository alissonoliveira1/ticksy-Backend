import { Request, Response } from "express";
import prisma from "../models/prismaClient";
import cloudinary from "../utils/cloudinary";


export interface AuthRequest extends Request {
    user?: {
        uid: string; 
        email: string;
    };
}
export const updateUser = async (req: AuthRequest, res: Response) => {
    
    // 1. Extrai o UID injetado pelo middleware 'firebaseAuth'
    const uid = req.user?.uid; 
    
    // Caso o middleware de autenticação falhe em anexar o UID
    if (!uid) {
        return res.status(401).json({ error: "Não autorizado. UID não encontrado no token." });
    }

    // 2. Extrai os dados do corpo da requisição
    const { nome, sobrenome, genero, telefone, data_nascimento } = req.body;
    
    // Objeto para construir os dados de atualização dinamicamente
    const dataToUpdate: any = {};

    if (nome !== undefined) dataToUpdate.nome = nome;
    if (sobrenome !== undefined) dataToUpdate.sobrenome = sobrenome;
    if (genero !== undefined) dataToUpdate.genero = genero;
    if (telefone !== undefined) dataToUpdate.telefone = telefone;

    if (data_nascimento !== undefined) {
        try {
            // Converte a string para objeto Date
            dataToUpdate.data_nascimento = new Date(data_nascimento);
        } catch (e) {
            return res.status(400).json({ error: "Formato de data de nascimento inválido." });
        }
    }
    
    // Verifica se há algo para atualizar
    if (Object.keys(dataToUpdate).length === 0) {
         return res.status(400).json({ error: "Nenhum dado válido para atualização foi fornecido." });
    }

    try {
        // 3. Tenta atualizar o usuário no banco de dados
        const updatedUser = await prisma.usuarios.update({
            where: { 
                firebase_uid: uid // Usa o UID para localizar o registro
            }, 
            data: dataToUpdate,
            select: { // Retorna apenas os campos que o frontend precisa
                id: true,
                firebase_uid: true,
                nome: true,
                sobrenome: true,
                email: true,
                genero: true,
                telefone: true,
                data_nascimento: true,
                // ... inclua aqui todos os campos que você deseja no retorno
            }
        });

        // 4. Sucesso!
        return res
            .status(200)
            .json({ message: "Usuário atualizado com sucesso", usuario: updatedUser });
            
    } catch (error: any) {
        
        // 5. TRATAMENTO DE ERRO CRÍTICO DO PRISMA (Registro não encontrado)
        // O código 'P2025' é específico do Prisma para 'Record not found'
        if (error.code === 'P2025') {
            console.error(`ERRO P2025: Usuário com UID ${uid} não encontrado na tabela 'usuarios'.`);
            return res.status(404).json({ error: "Usuário não encontrado" });
        }

        // Outros erros de banco de dados ou servidor
        console.error(`Erro ao atualizar usuário com UID ${uid}:`, error);
        return res
            .status(500)
            .json({ error: "Erro interno ao atualizar usuário." });
    }
};

export const updateImg = async (req: Request, res: Response) => {
  const { uid } = req.params;
  if (!uid) {
    return res
      .status(400)
      .json({ error: "O ID do usuário (UID) é obrigatório." });
  }

  const file = req.file;
  if (!file) {
    return res.status(400).json({ error: "Nenhuma imagem enviada" });
  }

  try {
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
