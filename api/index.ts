import express from "express";
import { GoogleGenAI } from "@google/genai";

const app = express();

app.use(express.json({ limit: "10mb" }));

// API Health Check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", app: "Planejamento Pedagógico API" });
});

// AI Pedagogical Assistant Route
app.post("/api/ai/generate-lesson", async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: "GEMINI_API_KEY não configurada no servidor."
      });
    }

    const { prompt, ageGroup, subject, theme } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "O prompt é obrigatório." });
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `Você é um especialista em Educação Infantil e na BNCC (Base Nacional Comum Curricular do Brasil).
Sua tarefa é criar um plano de aula pedagógico completo, criativo, lúdico e alinhado com a BNCC.
Retorne EXCLUSIVAMENTE um JSON válido com a seguinte estrutura:
{
  "nome": "Nome chamativo e lúdico da aula",
  "disciplina": "Linguagem | Matemática | Artes | Natureza e Sociedade | Musicalização | Educação Física | Ensino Religioso/Devocional | Outro",
  "tema": "Tema da aula",
  "objetivos": "Objetivos pedagógicos em tópicos (ex: - Desenvolver a oralidade...)",
  "bnccCodes": ["EI03ET07", "EI03CG02"],
  "desenvolvimento": "Passo a passo detalhado do desenvolvimento da aula com acolhida, problematização, atividade prática e fechamento.",
  "materiais": ["Massinha", "Cartolina", "Giz de cera"],
  "brincadeiras": "Descrição de uma brincadeira ou circuito motor complementar",
  "observacoes": "Dicas de adaptação, avaliação formativa ou cuidados de segurança"
}
Responda APENAS com o JSON. Não inclua marcas de formatação markdown adicionais além do bloco de código json.`;

    const userPrompt = `Solicitação do professor: "${prompt}"
Faixa Etária desejada: ${ageGroup || "Crianças pequenas (4 a 5 anos - EI03)"}
Disciplina sugerida: ${subject || "Geral / Integrada"}
Tema sugerido: ${theme || "Lúdico"}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });

    const text = response.text || "{}";
    const parsedData = JSON.parse(text);

    res.json({ success: true, lesson: parsedData });
  } catch (err: any) {
    console.error("Erro ao gerar aula com IA:", err);
    res.status(500).json({
      error: "Falha ao gerar plano de aula com IA.",
      details: err?.message || String(err)
    });
  }
});

export default app;
