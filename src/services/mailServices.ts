import nodemailer from "nodemailer";
import { Resend } from 'resend';
export async function sendVerificationEmail(email: string, code: string) {

const resend = new Resend(process.env.RESEND_API_KEY);

 await resend.emails.send({
    from: 'SeuApp <no-reply@seuapp.com>',
    to: email,
    subject: 'Seu código de verificação',
    html: `<h1>${code}</h1><p>Seu código expira em 5 minutos.</p>`,
  });

}
