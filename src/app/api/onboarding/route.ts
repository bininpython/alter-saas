import { NextResponse } from "next/server";
import axios from "axios";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];
    
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    const decoded: any = jwt.verify(token, JWT_SECRET);
    const { goal, level, frequency, restrictions, equipment, preferences } = await req.json();

    // Atualiza o usuário com os dados do onboarding
    await prisma.user.update({
      where: { id: decoded.id },
      data: {
        goal,
        level,
        onboardingCompleted: true,
      }
    });

    const prompt = `
      Você é um personal trainer profissional e nutricionista esportivo.
      Seu objetivo é criar um plano completo personalizado baseado nas informações do usuário.

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
    
    // Se a chave da API não estiver configurada, retornamos um mock para não quebrar o desenvolvimento
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
          model: "gpt-4-turbo",
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
        userId: decoded.id,
        data: plan,
      }
    });

    return NextResponse.json({ plan });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to generate plan" }, { status: 500 });
  }
}
