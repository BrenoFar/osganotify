require('dotenv').config();
const express = require('express');
const cors = require('cors');
const {
  inserirLog,
  buscarLogs,
  deletarLogPorDia,
} = require('./database');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// 1) Rota de entrada de log
app.post('/api/logs', (req, res) => {
  const { nomeUsuario, canal, data } = req.body;
  if (!nomeUsuario || !canal || !data) {
    return res.status(400).send('Dados incompletos');
  }

  // Inserção sem tempoHoras (fica null)
  inserirLog(nomeUsuario, canal, data);
  res.status(201).send('Log registrado com sucesso!');
});

// 2) Rota que recebe o tempo online calculado pelo bot
app.post('/api/tempo-online', (req, res) => {
  const { nomeUsuario, entrada, saida, tempoHoras } = req.body;
  if (!nomeUsuario || !entrada || !saida || !tempoHoras) {
    return res.status(400).send('Dados incompletos');
  }

  // Aqui inserimos como um novo registro, marcando canal como indicador
  inserirLog(nomeUsuario, '—tempo online—', entrada, tempoHoras);
  res.status(201).send('Tempo online registrado com sucesso!');
});

// 3) Rota de busca de logs (usada pelo client React)
app.get('/logs', (req, res) => {
  const filtros = {
    usuario: req.query.usuario,
    dataInicial: req.query.dataInicial,
    dataFinal: req.query.dataFinal,
  };

  buscarLogs(filtros, (err, logs) => {
    if (err) {
      console.error('Erro ao buscar logs:', err);
      return res.status(500).json([]);
    }
    res.json(logs);
  });
});

// 4) Rota para deletar logs antigos
app.post('/deletarlogdia', (req, res) => {
  const { data } = req.body;
  if (!data) {
    return res.status(400).send('Data obrigatória');
  }

  deletarLogPorDia(data);
  res.send('Logs antigos deletados com sucesso!');
});

app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});
