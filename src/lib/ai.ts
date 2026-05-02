import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Dados de fallback completos para quando a API do Gemini não está disponível
function getFallbackPlan(userData: any) {
  const goal = userData.goal || "hipertrofia";
  const level = userData.level || "iniciante";

  const plans: Record<string, any> = {
    emagrecimento: {
      training: {
        split: "Full Body - Queima",
        days: [
          {
            day: "Segunda-feira",
            focus: "Full Body A",
            exercises: [
              { name: "Agachamento Livre", sets: "4", reps: "15", rest: "45s" },
              { name: "Supino Reto", sets: "3", reps: "12", rest: "60s" },
              { name: "Remada Curvada", sets: "3", reps: "12", rest: "60s" },
              { name: "Elevação Lateral", sets: "3", reps: "15", rest: "30s" },
              { name: "Abdominal Crunch", sets: "3", reps: "20", rest: "30s" },
              { name: "Esteira HIIT", sets: "1", reps: "20min", rest: "-" }
            ]
          },
          {
            day: "Quarta-feira",
            focus: "Full Body B",
            exercises: [
              { name: "Leg Press 45°", sets: "4", reps: "15", rest: "45s" },
              { name: "Puxada Frontal", sets: "3", reps: "12", rest: "60s" },
              { name: "Desenvolvimento", sets: "3", reps: "12", rest: "60s" },
              { name: "Tríceps Pulley", sets: "3", reps: "15", rest: "30s" },
              { name: "Rosca Direta", sets: "3", reps: "12", rest: "30s" },
              { name: "Bike Intervalada", sets: "1", reps: "20min", rest: "-" }
            ]
          },
          {
            day: "Sexta-feira",
            focus: "Full Body C",
            exercises: [
              { name: "Stiff", sets: "4", reps: "12", rest: "60s" },
              { name: "Supino Inclinado", sets: "3", reps: "12", rest: "60s" },
              { name: "Remada Baixa", sets: "3", reps: "12", rest: "60s" },
              { name: "Elevação Frontal", sets: "3", reps: "15", rest: "30s" },
              { name: "Prancha", sets: "3", reps: "45s", rest: "30s" },
              { name: "Pular Corda", sets: "1", reps: "15min", rest: "-" }
            ]
          }
        ],
        tips: "Mantenha a intensidade alta com intervalos curtos. Foque na contração muscular e na postura. Combine com aeróbico no final de cada sessão para maximizar a queima calórica."
      },
      nutrition: {
        breakfast: "2 ovos mexidos + 1 fatia de pão integral + 1 fruta (banana ou maçã) + café sem açúcar",
        lunch: "150g frango grelhado + arroz integral (4 colheres) + salada verde à vontade + azeite de oliva",
        snack: "1 iogurte natural + 2 colheres de aveia + morangos picados",
        dinner: "Omelete de 3 claras e 1 gema + legumes salteados + chá verde",
        tips: "Beba no mínimo 3 litros de água por dia. Evite açúcar refinado e ultraprocessados. Proteína em todas as refeições para preservar massa muscular."
      },
      motivation: "Cada gota de suor te aproxima do corpo que você merece. O processo dói, mas o resultado vale a pena! 🔥"
    },
    hipertrofia: {
      training: {
        split: "ABC - Hipertrofia",
        days: [
          {
            day: "Segunda-feira",
            focus: "Peito, Ombro e Tríceps",
            exercises: [
              { name: "Supino Reto com Barra", sets: "4", reps: "10", rest: "90s" },
              { name: "Supino Inclinado Halteres", sets: "3", reps: "12", rest: "60s" },
              { name: "Crossover", sets: "3", reps: "15", rest: "45s" },
              { name: "Desenvolvimento Militar", sets: "4", reps: "10", rest: "60s" },
              { name: "Elevação Lateral", sets: "3", reps: "15", rest: "30s" },
              { name: "Tríceps Testa", sets: "3", reps: "12", rest: "45s" }
            ]
          },
          {
            day: "Quarta-feira",
            focus: "Costas e Bíceps",
            exercises: [
              { name: "Barra Fixa", sets: "4", reps: "8", rest: "90s" },
              { name: "Remada Curvada", sets: "4", reps: "10", rest: "60s" },
              { name: "Puxada Frontal", sets: "3", reps: "12", rest: "60s" },
              { name: "Remada Unilateral", sets: "3", reps: "12", rest: "45s" },
              { name: "Rosca Direta", sets: "3", reps: "12", rest: "45s" },
              { name: "Rosca Martelo", sets: "3", reps: "12", rest: "45s" }
            ]
          },
          {
            day: "Sexta-feira",
            focus: "Pernas e Abdômen",
            exercises: [
              { name: "Agachamento Livre", sets: "4", reps: "10", rest: "120s" },
              { name: "Leg Press 45°", sets: "4", reps: "12", rest: "90s" },
              { name: "Cadeira Extensora", sets: "3", reps: "15", rest: "45s" },
              { name: "Mesa Flexora", sets: "3", reps: "12", rest: "45s" },
              { name: "Panturrilha em Pé", sets: "4", reps: "20", rest: "30s" },
              { name: "Abdominal Infra", sets: "3", reps: "20", rest: "30s" }
            ]
          }
        ],
        tips: "Progressão de carga semanal: aumente 2-5% quando completar todas as séries com boa forma. Descanse 48h entre treinos do mesmo grupo muscular."
      },
      nutrition: {
        breakfast: "3 ovos inteiros + 2 fatias pão integral + pasta de amendoim + banana + whey shake",
        lunch: "200g frango ou carne vermelha magra + arroz branco (6 colheres) + feijão + salada",
        snack: "Batata doce (200g) + frango desfiado (100g) + suco natural",
        dinner: "200g peixe (tilápia ou salmão) + macarrão integral + legumes refogados",
        tips: "Consuma 2g de proteína por kg corporal. Não pule refeições. Considere suplementar com creatina (5g/dia) e whey protein pós-treino."
      },
      motivation: "Músculos não são construídos no conforto. Cada série pesada é um tijolo na construção do seu melhor eu! 💪"
    },
    condicionamento: {
      training: {
        split: "Circuito - Resistência",
        days: [
          {
            day: "Segunda-feira",
            focus: "Circuito Upper Body",
            exercises: [
              { name: "Flexão de Braço", sets: "3", reps: "15", rest: "30s" },
              { name: "Remada com Halteres", sets: "3", reps: "15", rest: "30s" },
              { name: "Desenvolvimento", sets: "3", reps: "15", rest: "30s" },
              { name: "Burpees", sets: "3", reps: "10", rest: "45s" },
              { name: "Mountain Climbers", sets: "3", reps: "30s", rest: "30s" },
              { name: "Prancha Lateral", sets: "3", reps: "30s", rest: "30s" }
            ]
          },
          {
            day: "Quarta-feira",
            focus: "Circuito Lower Body",
            exercises: [
              { name: "Agachamento com Salto", sets: "3", reps: "12", rest: "30s" },
              { name: "Afundo Alternado", sets: "3", reps: "20", rest: "30s" },
              { name: "Wall Sit", sets: "3", reps: "45s", rest: "30s" },
              { name: "Box Jump", sets: "3", reps: "10", rest: "45s" },
              { name: "Sprint", sets: "5", reps: "30s", rest: "60s" },
              { name: "Polichinelo", sets: "3", reps: "50", rest: "30s" }
            ]
          },
          {
            day: "Sexta-feira",
            focus: "Full Body Funcional",
            exercises: [
              { name: "Kettlebell Swing", sets: "4", reps: "15", rest: "30s" },
              { name: "Turkish Get Up", sets: "3", reps: "5 cada", rest: "45s" },
              { name: "Battle Ropes", sets: "4", reps: "30s", rest: "30s" },
              { name: "Bear Crawl", sets: "3", reps: "20m", rest: "30s" },
              { name: "Abdominal V-Up", sets: "3", reps: "15", rest: "30s" },
              { name: "Corrida Leve", sets: "1", reps: "10min", rest: "-" }
            ]
          }
        ],
        tips: "Foque em manter o ritmo cardíaco elevado. Descanse o mínimo possível entre exercícios. A cada semana, tente reduzir os intervalos ou aumentar as repetições."
      },
      nutrition: {
        breakfast: "Açaí com granola e banana + 2 ovos cozidos + suco de laranja natural",
        lunch: "Frango grelhado + quinoa + legumes variados + azeite de oliva",
        snack: "Mix de castanhas + fruta + iogurte grego",
        dinner: "Sopa de legumes com frango desfiado + torrada integral",
        tips: "Carboidratos são combustível! Não os elimine. Hidrate-se constantemente durante e após o treino. Considere bebida isotônica em treinos acima de 1h."
      },
      motivation: "Resistência se constrói na persistência. Cada treino é uma prova de que você pode ir além dos seus limites! ⚡"
    }
  };

  return plans[goal] || plans.hipertrofia;
}

export async function generateFitnessPlan(userData: any) {
  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.0-flash",
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
    console.warn("GEMINI_API_KEY não configurada. Retornando dados de fallback.");
    return getFallbackPlan(userData);
  }

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    return JSON.parse(text);
  } catch (error: any) {
    console.error("Gemini API Error:", error?.message || error);
    console.warn("Usando plano de fallback devido a erro na API do Gemini.");
    // Retorna plano de fallback em vez de falhar
    return getFallbackPlan(userData);
  }
}
