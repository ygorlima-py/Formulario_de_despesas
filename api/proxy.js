export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Método não permitido" });
    return;
  }

  try {
    // Lê o body manualmente como buffer
    const buffers = [];
    for await (const chunk of req) {
      buffers.push(chunk);
    }
    const rawBody = Buffer.concat(buffers).toString();
    
    // Envia o body bruto para o Apps Script
    const resposta = await fetch(
      "https://script.google.com/macros/s/AKfycbyJpLLuom4HsJ73M3RpuCjy_Zx9wDZzsevw4VmnKX08_-lfHflhQ3TQ_d2pE_Ad7eT5ww/exec",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: rawBody,
      }
    );
    let dados;
    try {
      dados = await resposta.json();
      res.status(200).json(dados);
    } catch (jsonErr) {
      const texto = await resposta.text();
      res.status(500).json({ error: "Resposta não é JSON", conteudo: texto });
    }
  } catch (e) {
    res.status(500).json({ error: "Erro ao enviar para o Apps Script", details: e.message });
  }
}