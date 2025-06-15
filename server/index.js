require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { inserirLog, buscarLogs } = require('./database');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.post('/api/logs', (req, res) => {
  const { nomeUsuario, canal, data } = req.body;
  if (!nomeUsuario || !canal || !data) return res.status(400).send('Dados incompletos');

  inserirLog(nomeUsuario, canal, data);
  res.status(201).send('Log registrado');
});

app.get('/logs', (req, res) => {
  const filtros = {
    usuario: req.query.usuario,
    dataInicial: req.query.dataInicial,
    dataFinal: req.query.dataFinal,
  };

app.post('/deletarlogdia', (req, res)=> {
  
})

  buscarLogs(filtros, (err, logs) => {
    if (err) return res.status(500).send([]);
    res.json(logs);
  });
});

app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});
