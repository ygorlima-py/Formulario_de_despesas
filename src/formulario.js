import React, { useState } from "react";

const opcoesIndicador = [
  "Alimentação",
  "Cartório",
  "Combustíveis",
  "Fretes e Carretos",
  "Hospedagem",
  "Impressões e Cópias",
  "Locação de Veículos, Máquinas e Equipamentos",
  "Materiais de Expediente e Utensílios",
  "Manutenção de Veículos",
  "Postagens e Malotes",
  "Taxas e Impostos",
  "Telefonia e Dados",
  "Tercerização de Serviços",
  "Translado",
  "Inscrição de Curso e Treinamento"
];

const meses = [
  "JANEIRO", "FEVEREIRO", "MARÇO", "ABRIL", "MAIO", "JUNHO",
  "JULHO", "AGOSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO"
];

export default function FormularioDespesas() {
  const [form, setForm] = useState({
    mes: "",
    indicador: "",
    discriminacao: "",
    fornecedor: "",
    cidade: "",
    nf: "",
    data: "",
    quantidade: "",
    valor: ""
  });

  // Salva cada registro como um novo item no localStorage
  // Aqui os dados do formulário são salvos em formato JSON no localStorage na chave "despesas"
  const salvar = () => {
    const registros = JSON.parse(localStorage.getItem("despesas") || "[]");
    // Se não for digitado nada em nf, salva como "-"
    const nfFinal = form.nf && form.nf.trim() !== "" ? form.nf : "-";
    // Converte todos os campos de texto para maiúsculo antes de salvar
    const registroMaiusculo = {
      ...form,
      mes: form.mes.toUpperCase(),
      indicador: form.indicador.toUpperCase(),
      discriminacao: form.discriminacao.toUpperCase(),
      fornecedor: form.fornecedor.toUpperCase(),
      cidade: form.cidade.toUpperCase(),
      nf: nfFinal.toUpperCase(),
      quantidade: form.quantidade,
      valor: form.valor,
      id: Date.now()
    };
    registros.push(registroMaiusculo);
    localStorage.setItem("despesas", JSON.stringify(registros)); // <-- Salva o array atualizado em JSON
    setForm({
      mes: "",
      indicador: "",
      discriminacao: "",
      fornecedor: "",
      cidade: "",
      nf: "",
      data: "",
      quantidade: "",
      valor: ""
    });
    alert("Despesa salva localmente!");
  };

  // Função para enviar os dados salvos no localStorage para o servidor
  const enviarDados = async () => {
    const registros = JSON.parse(localStorage.getItem("despesas") || "[]");
    if (registros.length === 0) {
      alert("Nenhum dado para enviar.");
      return;
    }
    try {
      const resposta = await fetch("/api/proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registros)
      });
      const resultado = await resposta.json();
      if (resultado.status === "ok") {
        alert("Dados enviados com sucesso!");
        localStorage.removeItem("despesas"); // Limpa os dados locais após envio
      } else {
        alert("Erro ao enviar dados: " + JSON.stringify(resultado));
      }
    } catch (e) {
      alert("Erro de conexão ao enviar dados: " + e.message);
    }
  };

  // Salva ao pressionar Enter em qualquer campo
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      salvar();
    }
  };

  return (
    <>
      <form className="formulario" onKeyDown={handleKeyDown}>
        <label>Mês:</label>
        <select
          value={form.mes}
          onChange={e => setForm({ ...form, mes: e.target.value })}
          required
        >
          <option value="">Selecione o mês</option>
          {meses.map((mes, i) => (
            <option key={i} value={mes}>{mes}</option>
          ))}
        </select>

        <label>Indicador:</label>
        <select
          value={form.indicador}
          onChange={e => setForm({ ...form, indicador: e.target.value })}
          required
        >
          <option value="">Selecione</option>
          {opcoesIndicador.map((op, i) => (
            <option key={i} value={op}>{op}</option>
          ))}
        </select>

        <label>Discriminação da despesa:</label>
        <input
          type="text"
          value={form.discriminacao}
          onChange={e => setForm({ ...form, discriminacao: e.target.value })}
          required
        />

        <label>Fornecedor:</label>
        <input
          type="text"
          value={form.fornecedor}
          onChange={e => setForm({ ...form, fornecedor: e.target.value })}
          required
        />

        <label>Cidade:</label>
        <input
          type="text"
          value={form.cidade}
          onChange={e => setForm({ ...form, cidade: e.target.value })}
          required
        />

        <label>Numero da NF:</label>
        <input
          type="text"
          value={form.nf}
          onChange={e => setForm({ ...form, nf: e.target.value })}
          placeholder=""
        />

        <label>Data:</label>
        <input
          type="date"
          value={form.data}
          onChange={e => setForm({ ...form, data: e.target.value })}
          required
        />

        <label>Quantidade:</label>
        <input
          type="number"
          value={form.quantidade}
          min={1}
          onChange={e => setForm({ ...form, quantidade: e.target.value })}
          required
        />

        <label>Valor:</label>
        <input
          type="number"
          step="0.01"
          value={form.valor}
          onChange={e => setForm({ ...form, valor: e.target.value })}
          required
        />

        <div style={{ marginTop: 16 }}>
          <button type="button" onClick={salvar}>Salvar</button>
          <button type="button" style={{ marginLeft: 8 }} onClick={enviarDados}>Enviar</button>
        </div>
      </form>
      <footer style={{
        marginTop: 32,
        textAlign: 'center',
        color: '#aaa',
        fontSize: '1rem',
        fontFamily: 'Poppins, Arial, sans-serif'
      }}>
        Powered by Developer Ygor Lima
      </footer>
    </>
  );
}
