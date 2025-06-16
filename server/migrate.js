// migrate.js
const sqlite3 = require("sqlite3").verbose();
const path    = require("path");

const dbPath = path.join(__dirname, "logs.sqlite");
const db     = new sqlite3.Database(dbPath, err => {
  if (err) return console.error("Erro ao abrir DB:", err);
  console.log("DB aberto com sucesso.");
});

// Tenta adicionar a coluna tempoHoras
db.run(
  `ALTER TABLE voice_logs ADD COLUMN tempoHoras TEXT`,
  err => {
    if (err) {
      if (/duplicate column/i.test(err.message)) {
        console.log("Coluna tempoHoras já existe. Nada a fazer.");
      } else {
        console.error("Erro ao adicionar coluna:", err);
      }
    } else {
      console.log("Coluna tempoHoras adicionada com sucesso!");
    }
    db.close();
  }
);
