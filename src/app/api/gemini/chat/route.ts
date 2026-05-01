import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        goal: true,
        level: true,
        streak: true,
        totalWorkouts: true,
      },
    });

    const { message } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      // Fallback inteligente quando a API key não está configurada
      const fallbackResponses: Record<string, string> = {
        treino: "Para o seu nível, recomendo começar com 3 séries de 12 repetições nos exercícios compostos (supino, agachamento, remada). Descanse 60-90 segundos entre séries. Foque na execução correta antes de aumentar carga! 💪",
        dieta: "Uma boa base: café da manhã com ovos e tapioca, almoço com frango/peixe + arroz integral + salada, lanche com frutas + iogurte, e jantar leve com omelete e legumes. Beba pelo menos 2L de água por dia! 🥗",
        peso: "Para perder peso de forma saudável, combine treino de força com déficit calórico moderado (300-500 kcal). Não corte calorias demais! Priorize proteína (1.6-2g por kg corporal) para manter massa muscular. 📉",
        default: "Ótima pergunta! Como seu Personal Trainer AI, posso te ajudar com treinos, nutrição e dicas de performance. Me pergunte sobre exercícios específicos, dietas ou estratégias de treino! 🔥"
      };

      const lowerMessage = message.toLowerCase();
      let response = fallbackResponses.default;
      if (lowerMessage.includes("treino") || lowerMessage.includes("exerc")) {
        response = fallbackResponses.treino;
      } else if (lowerMessage.includes("diet") || lowerMessage.includes("comer") || lowerMessage.includes("alimenta")) {
        response = fallbackResponses.dieta;
      } else if (lowerMessage.includes("peso") || lowerMessage.includes("emagrec") || lowerMessage.includes("gord")) {
        response = fallbackResponses.peso;
      }

      return NextResponse.json({ response });
    }

    if (!message) {
      return NextResponse.json({ error: "Mensagem não fornecida" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const context = `Você é o Alter, um Personal Trainer AI especializado em fitness, musculação, nutrição esportiva e bem-estar.
Você ajuda usuários de academia a alcançarem seus objetivos de forma saudável e sustentável.

Informações do usuário atual:
- Nome: ${user?.name || "Usuário"}
- Objetivo: ${user?.goal || "Não definido"}
- Nível: ${user?.level || "Iniciante"}
- Streak de treinos: ${user?.streak || 0} dias
- Total de treinos: ${user?.totalWorkouts || 0}

Regras importantes:
1. Seja motivacional e positivo
2. Dê respostas curtas e diretas (máximo 3 parágrafos)
3. Use linguagem informal/brasileira
4. Quando der exercícios, mencione séries e repetições
5. Não substitua orientação médica ou nutricional profissional
6. Se perguntarem sobre dietas, lembre que você não é nutricionista
7. Sempre incentive a constância nos treinos`;

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: context }],
        },
        {
          role: "model",
          parts: [{ text: "Entendido! Sou o Alter, seu Personal Trainer AI. Estou pronto para te ajudar! Qual sua dúvida sobre treino, nutrição ou fitness hoje? 💪" }],
        },
      ],
    });

    const result = await chat.sendMessage(message);
    const response = result.response;
    const text = response.text();

    return NextResponse.json({ response: text });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: "Erro ao processar mensagem" }, { status: 500 });
  }
}
