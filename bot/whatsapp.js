require('dotenv').config();
const twilio = require('twilio');

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

function enviarMensagemWhatsApp(mensagem) {
  client.messages
    .create({
      from: process.env.TWILIO_WHATSAPP_FROM,
      to: process.env.TWILIO_WHATSAPP_TO,
      body: mensagem,
    })
    .then((msg) => console.log(`WhatsApp enviado para ${process.env.TWILIO_WHATSAPP_TO}: ${msg.sid}`))
    .catch(console.error);
}

module.exports = { enviarMensagemWhatsApp };
