// DeepSeek AI via OpenRouter - Personal Trainer AI Engine

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const DEEPSEEK_MODEL = "deepseek/deepseek-chat-v3-0324";

interface OpenRouterMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

async function callDeepSeek(messages: OpenRouterMessage[], jsonMode = false): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY não configurada");
  }

  const body: any = {
    model: DEEPSEEK_MODEL,
    messages,
    temperature: 0.7,
    max_tokens: 4000,
  };

  if (jsonMode) {
    body.response_format = { type: "json_object" };
  }

  const res = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
      "HTTP-Referer": "https://alter-fitness.com",
      "X-Title": "Alter Personal Trainer AI",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("OpenRouter API Error:", res.status, err);
    throw new Error(`OpenRouter API Error: ${res.status}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

// Dados de fallback para quando a API não está disponível
function getFallbackPlan(userData: any) {
  const goal = userData.goal || "hipertrofia";
  const plans: Record<string, any> = {
    emagrecimento: {
      training: {
        split: "Full Body - Queima",
        days: [
          {
            day: "Segunda-feira", focus: "Full Body A",
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
            day: "Quarta-feira", focus: "Full Body B",
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
            day: "Sexta-feira", focus: "Full Body C",
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
        tips: "Mantenha a intensidade alta com intervalos curtos. Foque na contração muscular e na postura."
      },
      nutrition: {
        calories: "1800 kcal",
        protein: "130g",
        carbs: "180g",
        fat: "55g",
        breakfast: "2 ovos mexidos + 1 fatia de pão integral + 1 fruta + café sem açúcar",
        lunch: "150g frango grelhado + arroz integral (4 colheres) + salada verde + azeite",
        snack: "1 iogurte natural + 2 colheres de aveia + morangos",
        dinner: "Omelete de 3 claras e 1 gema + legumes salteados + chá verde",
        tips: "Beba 3L de água/dia. Evite açúcar refinado e ultraprocessados."
      },
      motivation: "Cada gota de suor te aproxima do corpo que você merece. 🔥"
    },
    hipertrofia: {
      training: {
        split: "ABC - Hipertrofia",
        days: [
          {
            day: "Segunda-feira", focus: "Peito, Ombro e Tríceps",
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
            day: "Quarta-feira", focus: "Costas e Bíceps",
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
            day: "Sexta-feira", focus: "Pernas e Abdômen",
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
        tips: "Progressão de carga semanal: aumente 2-5% quando completar todas as séries com boa forma."
      },
      nutrition: {
        calories: "2800 kcal",
        protein: "180g",
        carbs: "320g",
        fat: "85g",
        breakfast: "3 ovos + 2 fatias pão integral + pasta de amendoim + banana + whey",
        lunch: "200g frango ou carne + arroz branco (6 colheres) + feijão + salada",
        snack: "Batata doce (200g) + frango desfiado (100g) + suco natural",
        dinner: "200g peixe + macarrão integral + legumes refogados",
        tips: "Consuma 2g de proteína por kg corporal. Considere creatina (5g/dia) e whey pós-treino."
      },
      motivation: "Cada série pesada é um tijolo na construção do seu melhor eu! 💪"
    },
    condicionamento: {
      training: {
        split: "Circuito - Resistência",
        days: [
          {
            day: "Segunda-feira", focus: "Circuito Upper Body",
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
            day: "Quarta-feira", focus: "Circuito Lower Body",
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
            day: "Sexta-feira", focus: "Full Body Funcional",
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
        tips: "Foque em manter o ritmo cardíaco elevado. Reduza intervalos ou aumente reps semanalmente."
      },
      nutrition: {
        calories: "2200 kcal",
        protein: "140g",
        carbs: "260g",
        fat: "70g",
        breakfast: "Açaí com granola e banana + 2 ovos cozidos + suco natural",
        lunch: "Frango grelhado + quinoa + legumes variados + azeite",
        snack: "Mix de castanhas + fruta + iogurte grego",
        dinner: "Sopa de legumes com frango desfiado + torrada integral",
        tips: "Carboidratos são combustível! Hidrate-se constantemente durante o treino."
      },
      motivation: "Resistência se constrói na persistência. Vá além dos seus limites! ⚡"
    }
  };
  return plans[goal] || plans.hipertrofia;
}

export async function generateFitnessPlan(userData: any) {
  const prompt = `Você é um personal trainer profissional e nutricionista esportivo brasileiro.
Crie um plano completo personalizado para o usuário.

Dados do Usuário:
- Nome: ${userData.name || "Atleta"}
- Sexo: ${userData.gender || "Não informado"}
- Objetivo: ${userData.goal}
- Nível: ${userData.level}
- Peso atual: ${userData.weight || "Não informado"}kg
- Altura: ${userData.height || "Não informado"}m
- Idade: ${userData.age || "Não informada"}
- Frequência semanal: ${userData.frequency || 3} dias
- Limitações: ${userData.restrictions || "Nenhuma"}
- Equipamentos: ${userData.equipment || "Academia completa"}
- Preferências alimentares: ${userData.preferences || "Nenhuma"}

Responda EXCLUSIVAMENTE em formato JSON com esta estrutura:
{
  "training": {
    "split": "Nome da divisão",
    "days": [
      {
        "day": "Dia da semana",
        "focus": "Foco do dia",
        "exercises": [
          {"name": "Exercício", "sets": "4", "reps": "12", "rest": "60s"}
        ]
      }
    ],
    "tips": "Dicas de treino"
  },
  "nutrition": {
    "calories": "2200 kcal",
    "protein": "160g",
    "carbs": "240g",
    "fat": "70g",
    "breakfast": "Sugestão café da manhã detalhada",
    "lunch": "Sugestão almoço detalhada",
    "snack": "Sugestão lanche detalhada",
    "dinner": "Sugestão jantar detalhada",
    "tips": "Dicas nutricionais"
  },
  "motivation": "Frase motivacional"
}

Use alimentos brasileiros. Adapte ao objetivo e nível. Seja detalhado nos exercícios.`;

  if (!process.env.OPENROUTER_API_KEY) {
    console.warn("OPENROUTER_API_KEY não configurada. Usando fallback.");
    return getFallbackPlan(userData);
  }

  try {
    const response = await callDeepSeek([
      { role: "system", content: "Você é um personal trainer AI brasileiro chamado Alter. Responda APENAS em JSON válido." },
      { role: "user", content: prompt }
    ], true);

    return JSON.parse(response);
  } catch (error: any) {
    console.error("DeepSeek API Error:", error?.message || error);
    return getFallbackPlan(userData);
  }
}

export async function chatWithPersonal(
  message: string,
  userContext: {
    name?: string;
    gender?: string;
    goal?: string;
    level?: string;
    weight?: number;
    height?: number;
    age?: number;
    streak?: number;
    totalWorkouts?: number;
  },
  history: OpenRouterMessage[] = []
): Promise<string> {
  const systemPrompt = `Você é o ALTER, um Personal Trainer AI de elite. Você é energético, motivacional e técnico.

PERFIL DO ALUNO:
- Nome: ${userContext.name || "Atleta"}
- Sexo: ${userContext.gender || "Não informado"}
- Objetivo: ${userContext.goal || "Não definido"}
- Nível: ${userContext.level || "Iniciante"}
- Peso: ${userContext.weight ? userContext.weight + "kg" : "Não informado"}
- Altura: ${userContext.height ? userContext.height + "m" : "Não informado"}
- Idade: ${userContext.age || "Não informada"}
- Streak: ${userContext.streak || 0} dias seguidos
- Total treinos: ${userContext.totalWorkouts || 0}

SUAS FUNÇÕES:
1. PERSONAL TRAINER: Elabora treinos, corrige execuções, sugere progressões
2. NUTRICIONISTA: Monta cardápios, calcula macros, sugere substituições
3. MOTIVADOR: Acompanha progresso, celebra conquistas, mantém consistência
4. CONSULTOR: Responde dúvidas sobre suplementação, descanso, recuperação

COMPORTAMENTO:
- Seja DIRETO e MOTIVACIONAL
- Use linguagem informal brasileira com emojis (💪🔥⚡🏆)
- Pergunte sobre o peso, medidas e como o aluno se sente
- Sugira exercícios baseados no objetivo do aluno
- Quando perguntarem sobre peso, elabore estratégias específicas
- Se o aluno não tiver peso registrado, PERGUNTE
- Máximo 3 parágrafos por resposta
- Dê orientações práticas e aplicáveis
- Quando falar de exercícios, sempre inclua séries x repetições
- Encerre com uma pergunta ou desafio para engajar o aluno`;

  const messages: OpenRouterMessage[] = [
    { role: "system", content: systemPrompt },
    ...history,
    { role: "user", content: message }
  ];

  if (!process.env.OPENROUTER_API_KEY) {
    return getFallbackChatResponse(message);
  }

  try {
    return await callDeepSeek(messages);
  } catch (error: any) {
    console.error("Chat DeepSeek Error:", error?.message);
    return getFallbackChatResponse(message);
  }
}

function getFallbackChatResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("treino") || lower.includes("exerc")) {
    return "Para o seu nível, recomendo 3 séries de 12 reps nos exercícios compostos (supino, agachamento, remada). Descanse 60-90s entre séries. Foque na execução! 💪 Qual grupo muscular quer trabalhar hoje?";
  }
  if (lower.includes("diet") || lower.includes("comer") || lower.includes("alimenta") || lower.includes("refeição")) {
    return "Uma base sólida: café da manhã com ovos e tapioca, almoço com frango/peixe + arroz integral + salada, lanche com frutas + iogurte, jantar leve. Beba 2L+ de água! 🥗 Me conta seu objetivo que monto um cardápio!";
  }
  if (lower.includes("peso") || lower.includes("emagrec") || lower.includes("gord")) {
    return "Para perder peso saudavelmente: combine treino de força + déficit calórico de 300-500 kcal. Priorize proteína (1.6-2g/kg). Não corte demais! 📉 Qual seu peso atual? Posso calcular suas necessidades!";
  }
  if (lower.includes("suplemento") || lower.includes("whey") || lower.includes("creatina")) {
    return "Os essenciais: Whey Protein pós-treino (30g), Creatina (5g/dia todos os dias), e Vitamina D se necessário. Suplementos são complementos, não substitutos de uma boa alimentação! 💊 Já usa algum?";
  }
  return "Ótima pergunta! Como seu Personal AI, posso te ajudar com treinos, nutrição, suplementação e estratégias de performance. Me conta: qual seu objetivo principal agora? 🔥";
}

export async function generateWeeklyReport(userData: {
  name?: string;
  goal?: string;
  level?: string;
  weight?: number;
  streak?: number;
  totalWorkouts?: number;
  weeklyWorkouts?: number;
  checkins?: any[];
}): Promise<any> {
  const prompt = `Gere um relatório semanal de progresso fitness.

Dados do aluno:
- Nome: ${userData.name || "Atleta"}
- Objetivo: ${userData.goal || "Hipertrofia"}
- Nível: ${userData.level || "Iniciante"}
- Peso atual: ${userData.weight || "Não informado"}kg
- Streak atual: ${userData.streak || 0} dias
- Treinos na semana: ${userData.weeklyWorkouts || 0}
- Total de treinos: ${userData.totalWorkouts || 0}
- Check-ins recentes: ${JSON.stringify(userData.checkins || [])}

Responda em JSON:
{
  "summary": "Resumo da semana em 2 frases",
  "score": 75,
  "highlights": ["Conquista 1", "Conquista 2"],
  "improvements": ["Melhoria 1", "Melhoria 2"],
  "nextWeekTips": ["Dica 1", "Dica 2", "Dica 3"],
  "motivationalMessage": "Mensagem motivacional personalizada",
  "weeklyGoals": [
    {"goal": "Meta 1", "type": "training"},
    {"goal": "Meta 2", "type": "nutrition"},
    {"goal": "Meta 3", "type": "habit"}
  ]
}`;

  if (!process.env.OPENROUTER_API_KEY) {
    return {
      summary: `Semana de progresso! Você completou ${userData.weeklyWorkouts || 0} treinos.`,
      score: Math.min(100, (userData.weeklyWorkouts || 0) * 20 + (userData.streak || 0) * 5),
      highlights: ["Manteve a consistência!", "Completou seus treinos programados"],
      improvements: ["Aumentar ingestão de água", "Dormir 8h por noite"],
      nextWeekTips: ["Aumente a carga em 5%", "Adicione 1 dia de cardio", "Prepare marmitas no domingo"],
      motivationalMessage: "Você está no caminho certo! Cada treino conta. Continue firme! 🔥",
      weeklyGoals: [
        { goal: "Completar 4 treinos", type: "training" },
        { goal: "Beber 3L de água por dia", type: "nutrition" },
        { goal: "Dormir antes das 23h", type: "habit" }
      ]
    };
  }

  try {
    const response = await callDeepSeek([
      { role: "system", content: "Você é o Alter, personal trainer AI. Gere relatórios motivacionais e técnicos. Responda APENAS em JSON." },
      { role: "user", content: prompt }
    ], true);
    return JSON.parse(response);
  } catch (error: any) {
    console.error("Weekly Report Error:", error?.message);
    return {
      summary: `Continue firme! Você tem ${userData.streak || 0} dias de streak.`,
      score: 60,
      highlights: ["Você está ativo na plataforma!"],
      improvements: ["Manter a consistência nos treinos"],
      nextWeekTips: ["Foque em exercícios compostos", "Hidratação é fundamental"],
      motivationalMessage: "O progresso é lento mas constante. Não desista! 💪",
      weeklyGoals: [
        { goal: "Treinar 3x na semana", type: "training" },
        { goal: "Comer proteína em todas refeições", type: "nutrition" },
        { goal: "Registrar peso diariamente", type: "habit" }
      ]
    };
  }
}
