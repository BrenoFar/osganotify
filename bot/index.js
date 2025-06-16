require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const fetch = require("node-fetch");
const { enviarMensagemWhatsApp } = require("./whatsapp");

// Mapa em memória para guardar hora de entrada
const entradaUsuarios = new Map();

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
  if (!user) return;

  // ═══════════════════ ENTRADA ═══════════════════
  if (!oldState.channelId && newState.channelId) {
    if (newState.guild.id !== process.env.DISCORDIDGROUP) return;

    const nomeUsuario = user.username;
    const canal = newState.channel.name;

    console.log(`${nomeUsuario} entrou no canal ${canal}`);
    enviarMensagemWhatsApp(`${nomeUsuario} entrou no canal de voz: ${canal}.`);

    // ← Aqui registramos a hora de entrada!
    entradaUsuarios.set(user.id, new Date());

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
      console.log("Log de entrada enviado ao backend");
    } catch (error) {
      console.error("Erro ao enviar log para backend:", error);
    }
  }

  // ═══════════════════ SAÍDA ═══════════════════
  if (oldState.channelId && !newState.channelId && entradaUsuarios.has(user.id)) {
    const horaEntrada = entradaUsuarios.get(user.id);
    const horaSaida = new Date();
    const diffMs = horaSaida - horaEntrada;
    const tempoHoras = (diffMs / (1000 * 60 * 60)).toFixed(2);
    const nomeUsuario = user.username;

    console.log(`${nomeUsuario} saiu do canal e ficou por ${tempoHoras} horas`);

    try {
      await fetch("http://localhost:3001/api/tempo-online", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nomeUsuario,
          entrada: horaEntrada.toISOString(),
          saida: horaSaida.toISOString(),
          tempoHoras,
        }),
      });
      console.log("Tempo online enviado ao backend");
    } catch (err) {
      console.error("Erro ao enviar tempo online:", err);
    }

    entradaUsuarios.delete(user.id);
  }
});

client.login(process.env.DISCORD_TOKEN);
