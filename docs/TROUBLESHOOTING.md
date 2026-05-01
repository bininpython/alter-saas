# Troubleshooting (Login/Cadastro/Google)

## 1) Sintoma: `/api/health` retorna 404
Significa que o deploy atual não contém a rota `src/app/api/health/route.ts` (código antigo).

Checklist:
- No Vercel, verifique **Deployments → Source commit**.
- Garanta que o domínio que você está acessando é o mesmo projeto que recebeu o último commit.
- Se necessário, force um redeploy sem cache.

## 2) Sintoma: “Server error” ao criar conta
Principais causas:
- `DATABASE_URL` inválida no Vercel
- Banco sem as tabelas do Prisma/NextAuth
- Pooler/pgBouncer exigindo parâmetros específicos

Checklist:
- Rode `npx prisma db push` localmente apontando para a mesma `DATABASE_URL`.
- Acesse `GET /api/health` e veja se volta `ok: true`.

## 3) Sintoma: Google Login não funciona
Causas mais comuns:
- Redirect URI não bate com o domínio
- `NEXTAUTH_URL` diferente do domínio acessado
- Tentativa de login em domínio de preview do Vercel (muda sempre)

Checklist:
- Use um domínio estável (ex: `https://alter-saas.vercel.app`)
- No Google OAuth Client:
  - JS origin: `https://alter-saas.vercel.app`
  - Redirect URI: `https://alter-saas.vercel.app/api/auth/callback/google`
- No Vercel:
  - `NEXTAUTH_URL=https://alter-saas.vercel.app`

## 4) Tokens e Sessões (NextAuth)
- Cookies de sessão são definidos pelo NextAuth.
- Se estiver “logando e voltando pro login”:
  - limpe cookies do domínio
  - verifique se `NEXTAUTH_SECRET` não mudou depois do deploy (isso invalida sessões)

## 5) Logs no Vercel
Vercel → Deployments → Logs:
- Erros de banco: `PrismaClientInitializationError`, `P1001`, `P1017`, timeouts.
- Erros de OAuth: `OAuthCallbackError`, `invalid_client`, `redirect_uri_mismatch`.

