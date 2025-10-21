import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

export async function sendVerificationEmail(email: string, code: string) {
  const msg = {
    to: email,
    from: process.env.EMAIL_FROM as string,
    subject: "Código de Verificação",
    text: `Seu código de verificação é: ${code}`,
    html: `
      <div style="font-family: Arial, sans-serif; text-align: center;">
        <h2>Seu código de verificação</h2>
        <p>Use o código abaixo para confirmar seu e-mail:</p>
        <h1 style="font-size: 36px; color: #4F46E5;">${code}</h1>
        <p>Este código expira em 5 minutos.</p>
      </div>
    `,
  };

  try {
    await sgMail.send(msg);
    console.log(`Código enviado para ${email}: ${code}`);
  } catch (error: any) {
    console.error("Erro ao enviar e-mail:", error.response?.body || error.message);
    throw new Error("Falha ao enviar o e-mail de verificação");
  }
}
