import { NextResponse } from "next/server";
import axios from "axios";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }
    
    const userId = (session.user as any).id;
    const { goal, level, frequency, restrictions, equipment, preferences } = await req.json();

    // Atualiza o usuário com os dados do onboarding
    await prisma.user.update({
      where: { id: userId },
      data: {
        goal,
        level,
        onboardingCompleted: true,
      }
    });

    const prompt = `
      Você é um personal trainer profissional e nutricionista esportivo.
      Seu objetivo é criar um plano completo personalizado baseado nas informações do usuário brasileiro.

      Considere:
      - Objetivo: ${goal}
      - Nível: ${level}
      - Frequência semanal: ${frequency || 3}
      - Limitações físicas ou lesões: ${restrictions || 'Nenhuma'}
      - Equipamentos disponíveis: ${equipment || 'Nenhum'}
      - Preferências alimentares: ${preferences || 'Nenhuma'}

      Responda EXCLUSIVAMENTE em formato JSON com a seguinte estrutura:
      {
        "training": {
          "split": "Nome da divisão",
          "days": [
            {
              "day": "Dia da semana",
              "focus": "Foco do dia",
              "exercises": [
                {"name": "Nome", "sets": "séries", "reps": "repetições", "rest": "descanso"}
              ]
            }
          ],
          "tips": "Dicas de progressão"
        },
        "nutrition": {
          "breakfast": "...",
          "lunch": "...",
          "snack": "...",
          "dinner": "...",
          "tips": "Dicas adaptadas à realidade brasileira"
        },
        "motivation": "Mensagem motivacional de coach"
      }

      Regras:
      - Seja claro e direto
      - Priorize segurança física
      - Use linguagem motivacional
    `;

    let plan;
    
    if (!OPENAI_API_KEY || OPENAI_API_KEY === "your_openai_api_key_here") {
      console.warn("OpenAI API Key not configured. Returning mock data.");
      plan = {
        training: {
          split: "ABC",
          days: [{ day: "Segunda", focus: "Peito e Tríceps", exercises: [{ name: "Supino Inclinado", sets: "4", reps: "12", rest: "60s" }] }],
          tips: "Aumente o peso gradualmente a cada semana."
        },
        nutrition: {
          breakfast: "Ovos mexidos com tapioca",
          lunch: "Frango grelhado, arroz integral e feijão",
          snack: "Iogurte natural com frutas",
          dinner: "Peixe com legumes",
          tips: "Beba 3L de água por dia."
        },
        motivation: "O segredo do sucesso é a constância. Vamos pra cima!"
      };
    } else {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4o",
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" }
        },
        {
          headers: {
            "Authorization": `Bearer ${OPENAI_API_KEY}`,
            "Content-Type": "application/json"
          }
        }
      );
      plan = JSON.parse(response.data.choices[0].message.content);
    }
    
    // Salva o plano no banco de dados
    await prisma.workout.create({
      data: {
        userId: userId,
        data: plan,
      }
    });

    return NextResponse.json({ plan });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Falha ao gerar plano" }, { status: 500 });
  }
}
