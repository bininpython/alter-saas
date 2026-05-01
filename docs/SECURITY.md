# Segurança

## Práticas aplicadas
- Prisma ORM evita SQL injection por padrão (queries parametrizadas).
- Validação de payloads de APIs com Zod.
- Rotas restritas protegidas por `middleware.ts` e `getServerSession`.
- Senhas com hash `bcrypt`.
- Recuperação de senha com token aleatório e expiração (30 min).

## Recomendações
- Use `NEXTAUTH_SECRET` longo e rotacione se houver vazamento.
- Nunca comite `.env`. Use `.env.example`.
- Ative 2FA nas contas do Google/Vercel/Supabase.
- Para SMTP Gmail, use “Senha de app” (App Password), não sua senha normal.

