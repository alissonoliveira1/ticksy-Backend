import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
import { Resend } from 'resend';
dotenv.config();

sgMail.setApiKey(process.env.APIGRID as string);

export async function sendVerificationEmail(email: string, code: string) {
 const resend = new Resend(process.env.RESEND_KEY as string);


  const { data, error } = await resend.emails.send({
    from: 'Ticksy <ticksy.br@ticksy.com.br>',
    to: email,
    subject: 'Codigo de Verificação - Ticksy',
    html:  `
       <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;">
    
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td bgcolor="#f4f4f4" align="center" style="padding: 20px 10px;">
                
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden;">
                    
                    <tr>
                        <td align="center" style="padding: 40px 20px 20px 20px;">
                            <h1 style="margin: 0; font-size: 32px; font-weight: bold; color: #2a7ade;">
                                Ticksy
                            </h1>
                        </td>
                    </tr>
                    
                    <tr>
                        <td align="center" style="padding: 20px 30px 30px 30px; color: #333333; font-size: 16px; line-height: 1.5;">
                            
                            <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: bold; color: #111111;">
                                Confirme seu endereço de e-mail
                            </h2>
                            <p style="margin: 0 0 25px 0;">
                                Olá,
                            </p>
                            <p style="margin: 0 0 25px 0;">
                                Para concluir a configuração da sua conta, por favor, use o seguinte código de verificação:
                            </p>
                            
                            <div style="font-size: 36px; font-weight: bold; color: #111111; letter-spacing: 5px; padding: 15px 25px; border: 2px dashed #dddddd; display: inline-block; margin: 10px 0 30px 0; background-color: #f9f9f9; border-radius: 4px;">
                                ${code}
                            </div>

                            <p style="margin: 0 0 10px 0; font-size: 14px;">
                                Este código irá expirar em 10 minutos.
                            </p>
                            <p style="margin: 0; font-size: 14px; color: #555555;">
                                Se você não solicitou este e-mail, pode ignorá-lo com segurança.
                            </p>
                        </td>
                    </tr>
                    
                    <tr>
                        <td bgcolor="#f9f9f9" align="center" style="padding: 30px 20px 30px 20px; font-size: 12px; color: #777777; line-height: 1.4; border-top: 1px solid #eeeeee;">
                            <p style="margin: 0 0 10px 0;">
                                &copy; 2024 Ticksy. Todos os direitos reservados.
                            </p>
                            <p style="margin: 0;">
                                Se precisar de ajuda, entre em contato com nosso 
                                <a href="mailto:suporte@ticksy.com" style="color: #2a7ade; text-decoration: none; font-weight: bold;">
                                    suporte
                                </a>.
                            </p>
                        </td>
                    </tr>
                    
                </table>
                </td>
        </tr>
    </table>
    </body>
      `,
  });

  if (error) {
    return console.error({ error });
  }

  console.log({ data });

}
