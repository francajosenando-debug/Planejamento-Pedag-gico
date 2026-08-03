import express from "express";
import { GoogleGenAI } from "@google/genai";

const app = express();

app.use(express.json({ limit: "10mb" }));

// API Health Check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", app: "Planejamento Pedagógico API" });
});

// Helper to create GenAI instance
function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY não configurada no servidor.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

// 1. AI Single Lesson Generator Route
app.post("/api/ai/generate-lesson", async (req, res) => {
  try {
    const { prompt, ageGroup, subject, theme } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "O prompt é obrigatório." });
    }

    const ai = getGenAI();

    const systemInstruction = `Você é um especialista em Educação Infantil e na BNCC (Base Nacional Comum Curricular do Brasil).
Sua tarefa é criar um plano de aula pedagógico completo, criativo, lúdico e alinhado com a BNCC.
Retorne EXCLUSIVAMENTE um JSON válido com a seguinte estrutura:
{
  "nome": "Nome chamativo e lúdico da aula",
  "disciplina": "LINGUAGEM | MATEMÁTICA | ARTES | NATUREZA E SOCIEDADE | MUSICALIZAÇÃO | EDUCAÇÃO FÍSICA | AULA BÍBLICA / DEVOCIONAL",
  "tema": "Tema da aula",
  "objetivos": "Objetivos pedagógicos em tópicos (ex: - Desenvolver a oralidade e percepção espacial...)",
  "bnccCodes": ["EI03ET07", "EI03CG02"],
  "desenvolvimento": "Passo a passo detalhado do desenvolvimento da aula com acolhida, problematização, atividade prática e fechamento.",
  "materiais": ["Massinha", "Cartolina", "Giz de cera"],
  "brincadeiras": "Descrição de uma brincadeira ou circuito motor complementar",
  "observacoes": "Dicas de adaptação, avaliação formativa ou cuidados de segurança"
}`;

    const userPrompt = `Solicitação do professor: "${prompt}"
Faixa Etária desejada: ${ageGroup || "Crianças pequenas (4 a 5 anos - EI03)"}
Disciplina sugerida: ${subject || "Geral / Integrada"}
Tema sugerido: ${theme || "Lúdico"}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
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
      error: err?.message || "Falha ao gerar plano de aula com IA.",
      details: err?.message || String(err)
    });
  }
});

// 2. AI Full Weekly Planning Generator Route (5 Days: Segunda a Sexta)
app.post("/api/ai/generate-planning", async (req, res) => {
  try {
    const { theme, ageGroup, className, teacher } = req.body;

    if (!theme) {
      return res.status(400).json({ error: "O tema geral do planejamento é obrigatório." });
    }

    const ai = getGenAI();

    const systemInstruction = `Você é um coordenador pedagógico sênior especialista em Educação Infantil no Brasil e na BNCC.
Sua missão é gerar um PLANEJAMENTO SEMANAL COMPLETO DE 5 DIAS (Segunda-feira, Terça-feira, Quarta-feira, Quinta-feira, Sexta-feira) para uma turma de Educação Infantil.

Para CADA um dos 5 dias (segunda, terca, quarta, quinta, sexta), crie:
1. Uma rotina diária (routine) com 2 a 3 itens (acolhida, lanche, higiene, devocional).
2. De 1 a 2 aulas/atividades pedagógicas completas (lessons) com disciplina, tema, objetivos, códigos BNCC reais (ex: EI03ET07, EI03EF01, EI03CG02), desenvolvimento detalhado passo a passo e materiais.

Retorne EXCLUSIVAMENTE um JSON estritamente válido na seguinte estrutura:
{
  "className": "${className || "KINDER 3"}",
  "generalTheme": "${theme}",
  "project": "Nome de um projeto temático complementar",
  "bookWorked": "Título de um livro infantil recomendado para trabalhar essa semana",
  "days": {
    "segunda": {
      "dayName": "Segunda-feira",
      "dateStr": "Dia 1",
      "routine": [
        {
          "time": "13:00 – 13:30",
          "title": "ROTINA / ACOLHIDA",
          "description": "- Recepção das crianças com música de boas-vindas\\n- Acolhida e roda de conversa sobre a semana"
        }
      ],
      "lessons": [
        {
          "subject": "LINGUAGEM",
          "time": "13:30 – 14:30",
          "theme": "Nome lúdico da atividade",
          "objectives": "- Estimular a linguagem oral\\n- Ampliar vocabulário e escuta",
          "bnccCodes": ["EI03EF01"],
          "development": "<p><strong>Acolhida:</strong> Apresentação do tema em roda...</p><p><strong>Atividade Prática:</strong> ...</p>",
          "materials": ["Livro ilustrado", "Papel sulfite", "Giz de cera"]
        }
      ]
    },
    "terca": {
      "dayName": "Terça-feira",
      "dateStr": "Dia 2",
      "routine": [],
      "lessons": []
    },
    "quarta": {
      "dayName": "Quarta-feira",
      "dateStr": "Dia 3",
      "routine": [],
      "lessons": []
    },
    "quinta": {
      "dayName": "Quinta-feira",
      "dateStr": "Dia 4",
      "routine": [],
      "lessons": []
    },
    "sexta": {
      "dayName": "Sexta-feira",
      "dateStr": "Dia 5",
      "routine": [],
      "lessons": []
    }
  }
}`;

    const userPrompt = `Tema Geral da Semana: "${theme}"
Faixa Etária / Turma: ${ageGroup || "Crianças pequenas (4 a 5 anos - EI03)"}
Nome da Turma: ${className || "KINDER 3"}
Professor(a): ${teacher || "Profe Camila"}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });

    const text = response.text || "{}";
    const parsedData = JSON.parse(text);

    res.json({ success: true, planning: parsedData });
  } catch (err: any) {
    console.error("Erro ao gerar planejamento semanal com IA:", err);
    res.status(500).json({
      error: err?.message || "Falha ao gerar planejamento semanal com IA.",
      details: err?.message || String(err)
    });
  }
});

export default app;

