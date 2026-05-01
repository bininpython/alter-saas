import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function generateFitnessPlan(userData: any) {
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
    }
  });

  const prompt = `
    Você é um personal trainer profissional e nutricionista esportivo especializado no mercado brasileiro.
    Seu objetivo é criar um plano completo personalizado baseado nas informações do usuário.

    Dados do Usuário:
    - Objetivo: ${userData.goal}
    - Nível: ${userData.level}
    - Frequência semanal: ${userData.frequency || 3} dias
    - Limitações físicas: ${userData.restrictions || 'Nenhuma'}
    - Equipamentos: ${userData.equipment || 'Nenhum'}
    - Preferências alimentares: ${userData.preferences || 'Nenhuma'}

    Responda EXCLUSIVAMENTE em formato JSON com a seguinte estrutura exata:
    {
      "training": {
        "split": "Nome da divisão (Ex: ABC)",
        "days": [
          {
            "day": "Dia da semana",
            "focus": "Foco do dia",
            "exercises": [
              {"name": "Nome do exercício", "sets": "número", "reps": "repetições", "rest": "tempo"}
            ]
          }
        ],
        "tips": "Dicas de progressão e segurança"
      },
      "nutrition": {
        "breakfast": "Sugestão café da manhã",
        "lunch": "Sugestão almoço",
        "snack": "Sugestão lanche",
        "dinner": "Sugestão jantar",
        "tips": "Dicas de hidratação e suplementação"
      },
      "motivation": "Frase motivacional curta e impactante"
    }

    Regras:
    - Use linguagem motivacional e técnica.
    - Adapte os alimentos à realidade brasileira.
    - Garanta que os exercícios respeitem as limitações físicas mencionadas.
  `;

  if (!process.env.GEMINI_API_KEY) {
    console.warn("GEMINI_API_KEY não configurada. Retornando dados de simulação.");
    return {
      training: {
        split: "ABC - Iniciante",
        days: [
          {
            day: "Segunda-feira",
            focus: "Peito e Tríceps",
            exercises: [
              { name: "Supino Reto", sets: "3", reps: "12", rest: "60s" },
              { name: "Tríceps Pulley", sets: "3", reps: "15", rest: "45s" }
            ]
          },
          {
            day: "Quarta-feira",
            focus: "Costas e Bíceps",
            exercises: [
              { name: "Puxada Frente", sets: "3", reps: "12", rest: "60s" },
              { name: "Rosca Direta", sets: "3", reps: "12", rest: "45s" }
            ]
          }
        ],
        tips: "Mantenha a postura e beba água."
      },
      nutrition: {
        breakfast: "Pão integral com ovos",
        lunch: "Frango, arroz e salada",
        snack: "Fruta com aveia",
        dinner: "Omelete de legumes",
        tips: "Evite ultraprocessados."
      },
      motivation: "O primeiro passo é o mais importante!"
    };
  }

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Falha ao gerar plano com Gemini");
  }
}
