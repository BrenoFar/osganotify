import React, { useEffect, useState } from 'react';

function App() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/logs')
      .then(res => res.json())
      .then(data => setLogs(data))
      .catch(console.error);
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Logs de Entrada em Canais de Voz - OS GA</h1>
      {logs.length === 0 ? (
        <p>Nenhum log disponível.</p>
      ) : (
        <table border="1" cellPadding="10" cellSpacing="0">
          <thead>
            <tr>
              <th>Usuário</th>
              <th>Canal</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log.id}>
                <td>{log.nomeUsuario}</td>
                <td>{log.canal}</td>
                <td>{new Date(log.data).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
