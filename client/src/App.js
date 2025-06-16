import { useState } from "react";

function App() {
  const [logs, setLogs] = useState([]);
  const [usuario, setUsuario] = useState("");
  const [dataInicial, setDataInicial] = useState("");
  const [dataFinal, setDataFinal] = useState("");

  const fetchLogs = async () => {
    const params = new URLSearchParams();

    if (usuario) params.append("usuario", usuario);
    if (dataInicial) params.append("dataInicial", dataInicial);
    if (dataFinal) params.append("dataFinal", dataFinal);

    const res = await fetch(`http://localhost:3001/logs?${params.toString()}`);
    const data = await res.json();
    setLogs(data);
  };

  const handleFiltrar = (e) => {
    e.preventDefault();
    fetchLogs();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Logs de Voz</h1>

      <form onSubmit={handleFiltrar} className="mb-4 flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Nome do usuário"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          className="border p-2 rounded w-full sm:w-auto"
        />
        <input
          type="date"
          value={dataInicial}
          onChange={(e) => setDataInicial(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="date"
          value={dataFinal}
          onChange={(e) => setDataFinal(e.target.value)}
          className="border p-2 rounded"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Filtrar
        </button>
      </form>

      <ul>
        {logs.map((log) => (
          <li key={log.id} className="border-b py-2">
            <strong>{log.nomeUsuario}</strong>{" "}
            {log.canal === "—tempo online—" ? (
              <>ficou online por <strong>{log.tempoHoras}</strong> h</>
            ) : (
              <>entrou em <em>{log.canal}</em> em {new Date(log.data).toLocaleString()}</>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
