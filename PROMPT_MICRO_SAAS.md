# Prompt Completo para Criação do Micro SaaS de Academia - Alter

## Visão Geral do Projeto
Crie um micro SaaS de academia completo, semelhante a Anota Ai e Brendi, focado em personalização e automatização. O sistema funcionará como um **Personal Trainer AI individualizado** para cada usuário, com integração via WhatsApp.

---

## Funcionalidades Essenciais (MVP)

### 1. Autenticação e Onboarding
- Cadastro completo com nome, email, senha e WhatsApp
- Login com email/senha
- Onboarding detalhado:
  - Objetivo principal (emagrecimento, hipertrofia, condicionamento, saúde)
  - Nível de experiência (iniciante, intermediário, avançado)
  - Frequência semanal de treino
  - Restrições físicas ou lesões
  - Equipamentos disponíveis
  - Preferências alimentares e restrições
  - Medidas iniciais (peso, altura, circunferências)

### 2. Dashboard Principal
- Resumo diário com:
  - Progresso da meta
  - Treino do dia
  - Refeições a fazer
  - Streak de treinos
  - Próximo marco a alcançar
- Botão rápido para iniciar treino

### 3. Treinamento
- Planos de treino personalizados gerados por IA
- Divisão de treinos (ABC, ABCD, Upper/Lower, etc.)
- Detalhes de cada exercício:
  - Nome do exercício
  - Séries e repetições
  - Carga recomendada
  - Tempo de descanso
  - Vídeos ou GIFs de demonstração (opcional)
- Registro de sets em tempo real
- Histórico de treinos
- Tracker de PRs (Recorde Pessoal)

### 4. Nutrição
- Planos alimentares personalizados
- Distribuição de macronutrientes
- Refeições sugeridas com receitas simples
- Acompanhamento de água
- Registro de refeições (opção de foto ou texto)
- Sugestões de substituições
- Lembretes via WhatsApp para refeições

### 5. Progresso
- Gráficos de evolução de peso
- Gráficos de medidas corporais
- Acompanhamento de força nos exercícios
- Conquistas e badges gamificados
- Comparativo de fotos (antes/depois)
- Relatórios semanais e mensais

### 6. Perfil e Configurações
- Edição de dados pessoais
- Alteração de plano
- Gestão de assinatura
- Preferências de notificações
- Integração WhatsApp
- Logout

### 7. Integração WhatsApp (Funcionalidade Chave!)
- Lembretes automáticos de treino
- Lembretes de refeições e água
- Resumo diário via WhatsApp
- Mensagens motivacionais
- Chat com IA para dúvidas rápidas
- Opção de receber o treino do dia via WhatsApp

---

## Sugestões de Funcionalidades Adicionais (Para Escalar)

### Premium Features
1. **Vídeos de Exercícios**: Biblioteca completa de demonstrações
2. **Chat com Nutricionista**: Consultas semanais com profissional
3. **Rastreador de Suplementos**: Recomendações personalizadas
4. **Integração com Smartwatches**: Sync com Apple Health, Google Fit, Garmin
5. **Planos Avançados**: Periodização, tapering, deload weeks
6. **Receitas Exclusivas**: Biblioteca de receitas saudáveis
7. **Comunidade**: Grupo de usuários com objetivos semelhantes

### Operacionais
1. **Painel Admin**: Gestão de usuários, planos, analytics
2. **Sistema de Assinatura**: Integração com Mercado Pago, Stripe, PicPay
3. **Suporte**: Chat de suporte dentro do app
4. **Onboarding de Afiliados**: Programa de indicação
5. **Email Marketing**: Newsletter com dicas e novidades

---

## Stack Tecnológica Recomendada
- **Frontend**: Next.js 15+ (App Router) + TypeScript
- **Estilos**: Tailwind CSS + Framer Motion (animações)
- **UI Components**: shadcn/ui ou componentes customizados
- **Backend/API**: Next.js API Routes
- **Banco de Dados**: PostgreSQL (com Prisma ORM) ou Supabase
- **Autenticação**: Auth.js (NextAuth) ou JWT
- **IA**: OpenAI GPT-4o / Claude 3.5 Sonnet
- **WhatsApp**: Twilio, Z-API ou Wati
- **Pagamentos**: Mercado Pago SDK ou Stripe
- **Armazenamento**: AWS S3 ou Cloudinary (para fotos)
- **Analytics**: PostHog ou Google Analytics

---

## Exemplo de Prompt para Geração de Planos (Para IA)

```
Você é um Personal Trainer e Nutricionista Esportivo altamente qualificado, especializado em criação de planos personalizados.

Dados do Aluno:
- Nome: {nome}
- Objetivo: {objetivo}
- Nível: {nivel}
- Frequência semanal: {frequencia}
- Restrições: {restricoes}
- Equipamentos: {equipamentos}
- Peso inicial: {peso}kg
- Altura: {altura}cm

Gere um plano COMPLETO e PERSONALIZADO em formato JSON com a seguinte estrutura:

{
  "treinamento": {
    "divisao": "ABC",
    "dias": [
      {
        "dia": "Segunda-feira",
        "foco": "Peito e Tríceps",
        "exercicios": [
          {
            "nome": "Supino Reto",
            "series": 4,
            "repeticoes": "8-10",
            "carga": "80% de 1RM",
            "descanso": "90 segundos",
            "observacoes": "Mantenha a escápula aduzida"
          }
        ]
      }
    ],
    "dicas_progressao": "Aumente 2.5kg a cada semana nos exercícios compostos"
  },
  "nutricao": {
    "calorias_alvo": 2200,
    "macros": {
      "proteina": 165,
      "carboidratos": 220,
      "gorduras": 73
    },
    "refeicoes": [
      {
        "horario": "07:00",
        "nome": "Café da Manhã",
        "alimentos": ["Ovos mexidos (4 unidades)", "Tapioca (2 unidades)", "Café preto"]
      }
    ],
    "dicas": "Beba 3L de água por dia, distribuidos ao longo do dia"
  },
  "motivacao": "A chave do sucesso é a constância. Vamos focar no processo, não só no resultado!"
}

Regras importantes:
1. Seja realista com os pesos e cargas baseado no nível do aluno
2. Priorize exercícios compostos
3. Inclua progressão linear
4. Use linguagem simples e motivacional
5. Lembre-se de considerar restrições físicas
```

---

## Modelo de Negócio (SaaS)
- **Plano Gratuito**: Acesso básico, 1 plano, sem WhatsApp
- **Plano Premium (R$ 29,90/mês)**: Todos os recursos, integração WhatsApp, suporte prioritário
- **Plano Anual**: 2 meses grátis ao pagar anual (R$ 299/ano)

---

## Próximos Passos para Implementação
1. Finalizar as APIs de Treinamento e Nutrição
2. Adicionar integração WhatsApp
3. Implementar sistema de assinatura
4. Criar painel administrativo
5. Testes com usuários beta
6. Lançamento!
