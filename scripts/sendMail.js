const dotenv = require('dotenv');
const { Resend } = require('resend');

// Configurar dotenv para cargar las variables de entorno
dotenv.config();

// Crear una instancia de Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Función para enviar el correo
function sendEmail(to, subject, htmlContent) {
  return resend.emails.send({
    from: 'hablemos@genda.cl',
    to: to,
    subject: subject,
    html: htmlContent
  });
}

module.exports = { sendEmail };
