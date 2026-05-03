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
    temperature: 0.8, // Slightly higher for more unique, less repetitive responses
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
              { name: "Agachamento Livre", sets: "4", reps: "15", rest: "45s", target: "Quadríceps e Glúteos", explanation: "Trabalha a parte da frente da coxa e bumbum. Ótimo para queimar calorias." },
              { name: "Supino Reto", sets: "3", reps: "12", rest: "60s", target: "Peitoral", explanation: "Trabalha o peito, ombros e tríceps." },
              { name: "Remada Curvada", sets: "3", reps: "12", rest: "60s", target: "Costas", explanation: "Fortalece as costas e melhora a postura." },
              { name: "Elevação Lateral", sets: "3", reps: "15", rest: "30s", target: "Ombros", explanation: "Define a lateral dos ombros." },
              { name: "Abdominal Crunch", sets: "3", reps: "20", rest: "30s", target: "Abdômen", explanation: "Foco na parte superior da barriga." },
              { name: "Esteira HIIT", sets: "1", reps: "20min", rest: "-", target: "Cardio", explanation: "Treino intervalado para queima de gordura." }
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
        water: "3 Litros",
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
              { name: "Supino Reto com Barra", sets: "4", reps: "10", rest: "90s", target: "Peitoral", explanation: "Exercício base para construir massa no peito." },
              { name: "Supino Inclinado Halteres", sets: "3", reps: "12", rest: "60s", target: "Peitoral Superior", explanation: "Foca na parte de cima do peito." },
              { name: "Crossover", sets: "3", reps: "15", rest: "45s", target: "Peitoral", explanation: "Isola o peito para máximo pump." },
              { name: "Desenvolvimento Militar", sets: "4", reps: "10", rest: "60s", target: "Ombros", explanation: "Constrói ombros largos e fortes." },
              { name: "Elevação Lateral", sets: "3", reps: "15", rest: "30s", target: "Ombros", explanation: "Trabalha a lateral do ombro." },
              { name: "Tríceps Testa", sets: "3", reps: "12", rest: "45s", target: "Tríceps", explanation: "Foca no músculo do 'tchau'." }
            ]
          }
        ],
        tips: "Progressão de carga semanal: aumente 1-2kg quando completar todas as séries com boa forma."
      },
      nutrition: {
        calories: "2800 kcal",
        protein: "180g",
        carbs: "320g",
        fat: "85g",
        water: "4 Litros",
        breakfast: "3 ovos + 2 fatias pão integral + pasta de amendoim + banana + whey",
        lunch: "200g frango ou carne + arroz branco (6 colheres) + feijão + salada",
        snack: "Batata doce (200g) + frango desfiado (100g) + suco natural",
        dinner: "200g peixe + macarrão integral + legumes refogados",
        tips: "Consuma 2g de proteína por kg corporal. Beba 4L de água para hidratar os músculos."
      },
      motivation: "Cada série pesada é um tijolo na construção do seu melhor eu! 💪"
    }
  };
  return plans[goal] || plans.hipertrofia;
}

export async function generateFitnessPlan(userData: any) {
  const prompt = `Você é um personal trainer IA brasileiro extremamente exclusivo, focado em hiper-personalização. Você não cria treinos genéricos. Você cria obras-primas únicas para cada aluno.
Crie um PLANO MENSAL completo 100% personalizado, focado exatamente no que o usuário quer. O plano mensal consiste em um bloco de progressão de carga (onde a rotina semanal se repete por 4 semanas, com carga progressiva) e uma dieta mensal detalhada.

Dados ÚNICOS deste Usuário:
- Nome: ${userData.name || "Atleta"}
- Sexo: ${userData.gender || "Não informado"}
- Objetivo Principal: ${userData.goal}
- Nível de Experiência: ${userData.level}
- Foco Específico (Parte do corpo a melhorar): ${userData.targetBodyPart || "Equilibrado em todo o corpo"}
- Peso atual: ${userData.weight || "Não informado"}kg
- Histórico: ${userData.totalWorkouts || 0} treinos já realizados.

DIRETRIZES DO TREINO MENSAL:
1. FOCO: Priorize exercícios que trabalhem intensamente a área de foco: ${userData.targetBodyPart || "Geral"}.
2. DIVISÃO COMPLETA: O array "days" DEVE conter todos os dias do microciclo semanal da pessoa (ex: se for 3x, gere 3 objetos "day". Se for 5x, gere 5).
3. EXPLICAÇÃO (Para Iniciantes): Em cada exercício, adicione uma chave "target" (o músculo) e uma "explanation" explicando brevemente para que serve aquele movimento.
4. PROGRESSÃO MENSAL: Especifique como progredir a carga mês a mês na chave "tips".

DIRETRIZES DA DIETA MENSAL:
1. VARIEDADE: No array "dailyDiets", crie EXATAMENTE 7 opções de dias (um para cada dia da semana: Segunda-feira a Domingo), dando variedade diária ao cardápio mensal.
2. HÁBITOS: Inclua metas exatas de água baseadas no peso.

Responda EXCLUSIVAMENTE em formato JSON com esta estrutura EXATA:
{
  "training": {
    "split": "Nome criativo e único da divisão (ex: 'Destruidor de Deltóides do [Nome]')",
    "days": [
      {
        "day": "Nome do dia (ex: Segunda-feira)",
        "focus": "Foco do dia",
        "exercises": [
          {"name": "Exercício", "sets": "4", "reps": "12", "rest": "60s", "target": "Músculo Alvo", "explanation": "Por que estamos fazendo isso e o que ele trabalha"}
        ]
      }
    ],
    "tips": "Como progredir a carga durante o MÊS."
  },
  "nutrition": {
    "calories": "X kcal",
    "protein": "Y g",
    "carbs": "Z g",
    "fat": "W g",
    "water": "Meta de água (ex: 3.5 Litros)",
    "dailyDiets": [
      {
        "dayName": "Nome do dia (ex: Segunda-feira)",
        "breakfast": "Sugestão café da manhã única",
        "lunch": "Sugestão almoço",
        "snack": "Sugestão lanche",
        "dinner": "Sugestão jantar"
      }
    ],
    "tips": "Dicas nutricionais e controle de hábitos para o mês"
  },
  "motivation": "Frase motivacional impactante e super pessoal para o [Nome]"
}

IMPORTANTE: Seja criativo, evite planos enlatados. Os exercícios e os nomes dos treinos devem parecer feitos exclusivamente para ${userData.name || "este aluno"}.`;

  if (!process.env.OPENROUTER_API_KEY) {
    console.warn("OPENROUTER_API_KEY não configurada. Usando fallback.");
    return getFallbackPlan(userData);
  }

  try {
    const response = await callDeepSeek([
      { role: "system", content: "Você é o Alter, um Personal Trainer AI de luxo, 100% autônomo e exclusivo. Você foca em detalhes, progressão de carga, explicações musculares e personalização absurda. Responda APENAS em JSON válido." },
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
    targetBodyPart?: string;
  },
  history: OpenRouterMessage[] = []
): Promise<string> {
  const systemPrompt = `Você é o ALTER, um Personal Trainer IA particular, de luxo e totalmente autônomo. Você é 100% focado no seu aluno e age como se ele fosse o único no mundo.

PERFIL EXCLUSIVO DO SEU ALUNO:
- Nome: ${userContext.name || "Atleta"}
- Sexo: ${userContext.gender || "Não informado"}
- Objetivo: ${userContext.goal || "Não definido"}
- Nível: ${userContext.level || "Iniciante"}
- Foco Corporal Especial: ${userContext.targetBodyPart || "Nenhum específico"}
- Peso: ${userContext.weight ? userContext.weight + "kg" : "Não informado"}
- Streak atual: ${userContext.streak || 0} dias seguidos
- Total de treinos: ${userContext.totalWorkouts || 0}

SUAS REGRAS DE ATUAÇÃO:
1. PERSONALIZAÇÃO EXTREMA: Nunca dê respostas genéricas. Cite o nome do aluno, lembre do peso dele, do objetivo dele e do foco corporal que ele escolheu (${userContext.targetBodyPart || "melhorar o corpo todo"}).
2. DIDÁTICA PARA INICIANTES: Sempre que sugerir um exercício, explique de forma simples qual músculo ele trabalha e por que é bom.
3. PROGRESSÃO DE CARGA: Incentive o aumento de carga (sobrecarga progressiva) baseado no perfil da pessoa. Ensine como progredir (ex: mais repetições ou mais 1kg).
4. HÁBITOS TOTAIS: Sempre pergunte ou cobre sobre o consumo de água (ml/kg) e a alimentação. O treino não é nada sem a dieta.
5. EXCLUSIVIDADE: Aja como se você fosse um mentor de elite cobrando caro pela consultoria. Seja exigente, mas acolhedor e muito inteligente.

COMPORTAMENTO:
- Use emojis moderadamente para dar energia (🔥🧠💧).
- Responda em no máximo 3 ou 4 parágrafos curtos.
- Não seja repetitivo nas suas aberturas.
- Sempre termine com uma pergunta direta para manter o engajamento (sobre a água, sobre a dor muscular, ou sobre a dieta).`;

  const messages: OpenRouterMessage[] = [
    { role: "system", content: systemPrompt },
    ...history,
    { role: "user", content: message }
  ];

  if (!process.env.OPENROUTER_API_KEY) {
    return "Estou em manutenção rápida, mas não esqueça: beba água e mantenha a dieta! Já volto para ajustarmos seu treino. 💧🔥";
  }

  try {
    return await callDeepSeek(messages);
  } catch (error: any) {
    console.error("Chat DeepSeek Error:", error?.message);
    return "Estou focado em atualizar seus dados no momento. Me chame novamente em alguns segundos! 💪";
  }
}

export async function generateWeeklyReport(userData: {
  name?: string;
  goal?: string;
  level?: string;
  weight?: number;
  streak?: number;
  totalWorkouts?: number;
  weeklyWorkouts?: number;
  targetBodyPart?: string;
  checkins?: any[];
}): Promise<any> {
  const prompt = `Gere um relatório semanal de progresso fitness incrivelmente detalhado e personalizado.

Dados ÚNICOS deste Aluno:
- Nome: ${userData.name || "Atleta"}
- Objetivo: ${userData.goal || "Hipertrofia"}
- Nível: ${userData.level || "Iniciante"}
- Foco Corporal: ${userData.targetBodyPart || "Nenhum específico"}
- Peso atual: ${userData.weight || "Não informado"}kg
- Streak atual: ${userData.streak || 0} dias
- Treinos na semana: ${userData.weeklyWorkouts || 0}
- Total de treinos: ${userData.totalWorkouts || 0}

Diretrizes:
- Avalie o progresso em relação ao foco corporal escolhido.
- Adicione metas de progressão de carga e de hidratação.
- Não use frases genéricas.

Responda APENAS em JSON:
{
  "summary": "Resumo analítico e exclusivo da semana em 2 frases",
  "score": 85,
  "highlights": ["Conquista específica 1", "Conquista específica 2"],
  "improvements": ["Área a melhorar 1", "Área a melhorar 2"],
  "nextWeekTips": ["Dica de progressão de carga", "Dica de hidratação", "Dica focada na área alvo"],
  "motivationalMessage": "Mensagem motivacional forte, chamando o aluno pelo nome",
  "weeklyGoals": [
    {"goal": "Meta exata de treino (ex: Aumentar 2kg no supino)", "type": "training"},
    {"goal": "Meta de nutrição", "type": "nutrition"},
    {"goal": "Meta de hidratação (ex: Beber 3.5L/dia)", "type": "habit"}
  ]
}`;

  if (!process.env.OPENROUTER_API_KEY) {
    return {
      summary: `Semana de progresso, ${userData.name || 'campeão'}! Você completou ${userData.weeklyWorkouts || 0} treinos.`,
      score: Math.min(100, (userData.weeklyWorkouts || 0) * 20 + (userData.streak || 0) * 5),
      highlights: ["Manteve a consistência incrível!"],
      improvements: ["Beba mais água amanhã"],
      nextWeekTips: ["Aumente a carga em 2kg nos exercícios principais", "Durma 8h", "Foque na execução perfeita"],
      motivationalMessage: "O progresso é a soma de pequenos esforços repetidos diariamente. Vamos para a próxima semana! 🔥",
      weeklyGoals: [
        { goal: "Aumentar a carga em 1 exercício", type: "training" },
        { goal: "Beber 3L de água por dia", type: "habit" }
      ]
    };
  }

  try {
    const response = await callDeepSeek([
      { role: "system", content: "Você é o Alter, personal trainer AI de luxo. Gere relatórios analíticos, únicos e motivacionais. Responda APENAS em JSON." },
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
      nextWeekTips: ["Foque em exercícios compostos", "Acompanhe seu consumo de água"],
      motivationalMessage: "O progresso é lento mas constante. Não desista! 💪",
      weeklyGoals: [
        { goal: "Treinar 3x na semana", type: "training" },
        { goal: "Beber água conforme sua meta", type: "habit" }
      ]
    };
  }
}
