# 🛡️ OSGA Notify

Sistema completo de monitoramento de entrada em canais de voz no Discord, com bot, API e painel web.

## Estrutura

- `bot/`: Bot Discord (Node.js + Discord.js)
- `server/`: API REST + banco (Express + SQLite)
- `client/`: Front-end (React + Tailwind)

## Setup rápido

Cada pasta tem seu próprio `package.json`.

```bash
cd bot && npm install
cd ../server && npm install
cd ../client && npm install
