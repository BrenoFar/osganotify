const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const db = new sqlite3.Database(path.join(__dirname, "logs.sqlite"), (err) => {
  if (err) console.error(err);
});

// 1) Cria a tabela (se ainda não existir) com a nova coluna tempoHoras
db.run(`
  CREATE TABLE IF NOT EXISTS voice_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nomeUsuario TEXT,
    canal       TEXT,
    data        TEXT,
    tempoHoras  TEXT  
  )
`);


 
function inserirLog(nomeUsuario, canal, data, tempoHoras = null) {
  db.run(
    `INSERT INTO voice_logs (nomeUsuario, canal, data, tempoHoras) VALUES (?, ?, ?, ?)`,
    [nomeUsuario, canal, data, tempoHoras],
    (err) => {
      if (err) console.error(err);
    }
  );
}


function deletarLogPorDia(dataLimite) {
  db.run(
    `DELETE FROM voice_logs WHERE date(data) < date(?)`,
    [dataLimite],
    (err) => {
      if (err) console.error(err);
    }
  );
}


function buscarLogs(filtros, callback) {
  let query = `SELECT * FROM voice_logs WHERE 1=1`;
  const params = [];

  if (filtros.usuario) {
    query += ` AND nomeUsuario LIKE ?`;
    params.push(`%${filtros.usuario}%`);
  }

  if (filtros.dataInicial) {
    query += ` AND date(data) >= date(?)`;
    params.push(filtros.dataInicial);
  }

  if (filtros.dataFinal) {
    query += ` AND date(data) <= date(?)`;
    params.push(filtros.dataFinal);
  }

  query += ` ORDER BY id DESC LIMIT 100`;

  db.all(query, params, (err, rows) => {
    if (err) return callback(err);
    callback(null, rows);
  });
}

module.exports = { inserirLog, buscarLogs, deletarLogPorDia };
