import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { message, userData } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Mensagem não fornecida" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const context = `Você é o Alter, um Personal Trainer AI especializado em fitness, musculação, nutrição esportiva e bem-estar.
Você ajuda usuários de academia a alcançarem seus objetivos de forma saudável e sustentável.

Informações do usuário atual:
- Nome: ${userData?.name || "Usuário"}
- Objetivo: ${userData?.goal || "Não definido"}
- Nível: ${userData?.level || "Iniciante"}
- Streak de treinos: ${userData?.streak || 0} dias
- Total de treinos: ${userData?.totalWorkouts || 0}

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
