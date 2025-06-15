const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'logs.sqlite'), (err) => {
  if (err) console.error(err);
});

db.run(`
  CREATE TABLE IF NOT EXISTS voice_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nomeUsuario TEXT,
    canal TEXT,
    data TEXT
  )
`);

function inserirLog(nomeUsuario, canal, data) {
  db.run(
    `INSERT INTO voice_logs (nomeUsuario, canal, data) VALUES (?, ?, ?)`,
    [nomeUsuario, canal, data]
  );
}

function buscarLogs(callback) {
  db.all(`SELECT * FROM voice_logs ORDER BY id DESC LIMIT 100`, [], (err, rows) => {
    if (err) return callback([]);
    callback(rows);
  });
}

module.exports = { inserirLog, buscarLogs };
