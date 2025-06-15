require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const fetch = require("node-fetch"); // import fetch

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

client.once("ready", () => {
  console.log(`🤖 Bot conectado como ${client.user.tag}`);
});

client.on("voiceStateUpdate", async (oldState, newState) => {
  const user = newState.member?.user;

  if (!oldState.channelId && newState.channelId) {
    if (newState.guild.id !== process.env.DISCORDIDGROUP) return;

    const nomeUsuario = user?.username || "Usuário";
    const canal = newState.channel?.name || "Canal Desconhecido";

    console.log(`${nomeUsuario} entrou no canal ${canal}`);

    // Enviar para backend via POST
    try {
      await fetch("http://localhost:3001/api/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nomeUsuario,
          canal,
          data: new Date().toISOString(),
        }),
      });
      console.log("Log enviado para backend");
    } catch (error) {
      console.error("Erro ao enviar log para backend:", error);
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
