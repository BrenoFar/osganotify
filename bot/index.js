require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const { enviarMensagemWhatsApp } = require("./whatsapp");

// Inicializa bot
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

client.once("ready", () => {
  console.log(`🤖 Bot conectado como ${client.user.tag}`);
});

// Evento: Alguém entrou em um canal de voz
client.on("voiceStateUpdate", (oldState, newState) => {
  const user = newState.member?.user;

  // Se entrou em um canal de voz (e não apenas trocou de canal)
  if (!oldState.channelId && newState.channelId) {
    // Valida servidor
    if (newState.guild.id !== process.env.DISCORDIDGROUP) return;

    const nomeUsuario = user?.username || "Usuário";
    const canal = newState.channel?.name || "Canal Desconhecido";

    console.log(`${nomeUsuario} entrou no canal ${canal}`);
    enviarMensagemWhatsApp(`${nomeUsuario} entrou no canal de voz: ${canal}`);
  }
});

client.login(process.env.DISCORD_TOKEN);
