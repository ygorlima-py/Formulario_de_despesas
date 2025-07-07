export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Método não permitido" });
    return;
  }

  try {
    const resposta = await fetch(
      "https://script.google.com/macros/s/AKfycbyJpLLuom4HsJ73M3RpuCjy_Zx9wDZzsevw4VmnKX08_-lfHflhQ3TQ_d2pE_Ad7eT5ww/exec",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body),
      }
    );
    const dados = await resposta.json(); // Garante que sempre retorna JSON
    res.status(200).json(dados);
  } catch (e) {
    res.status(500).json({ error: "Erro ao enviar para o Apps Script", details: e.message });
  }
}