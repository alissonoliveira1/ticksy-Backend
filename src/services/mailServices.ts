import nodemailer from "nodemailer";

export async function sendVerificationEmail(email: string, code: string) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS,  
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'alissonoliveira201339@gmail.com',
    subject: "Código de Verificação",
    text: `Seu código de verificação é: ${code}`,
  };

  await transporter.sendMail(mailOptions);
}
