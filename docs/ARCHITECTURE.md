# Arquitetura Técnica (Alter SaaS)

## Visão Geral
Stack principal:
- Next.js (App Router) + TypeScript (frontend + backend no mesmo projeto)
- Auth: NextAuth (Auth.js) com Providers Google OAuth 2.0 + Credentials (email/senha)
- Banco: PostgreSQL via Prisma ORM
- IA: Gemini (chat) e OpenAI (geração de plano no onboarding)

## Fluxo de Autenticação

```mermaid
flowchart TD
  A[Usuário] --> B[/login]
  B -->|Email/Senha| C[NextAuth CredentialsProvider]
  B -->|Google| D[Google OAuth 2.0]
  D --> E[/api/auth/callback/google]
  C --> F[(PostgreSQL)]
  E --> F
  F --> G[Session/JWT NextAuth]
  G --> H[/dashboard (restrito)]
```

## Componentes
- UI:
  - `/login`, `/register`, `/forgot-password`, `/reset-password/[token]`
  - `/dashboard`, `/training`, `/nutrition`, `/progress`, `/profile` (restritos)
- API:
  - `/api/auth/[...nextauth]` (NextAuth)
  - `/api/auth/register` (cadastro email/senha)
  - `/api/auth/forgot-password` (gera token e envia e-mail)
  - `/api/auth/reset-password` (valida token e redefine senha)
  - `/api/user/data` (dados do usuário)
  - `/api/onboarding` (gera plano e salva)
  - `/api/gemini/chat` (chat IA, exige sessão)
  - `/api/health` (teste de conexão do banco)

## Proteção de Rotas
`middleware.ts` aplica autenticação em:
- Páginas: `/dashboard`, `/training`, `/nutrition`, `/progress`, `/profile`, `/onboarding`
- APIs: `/api/user/*`, `/api/onboarding/*`, `/api/gemini/*`

## Auditoria
Eventos persistidos em `AuditLog`:
- `auth.register`, `auth.signin`, `auth.signout`, `auth.create_user`, `auth.link_account`
- `auth.forgot_password`, `auth.reset_password`

