# Manual de Deploy (Produção)

## 1) Banco (Supabase/PostgreSQL)
1. Crie um projeto no Supabase.
2. Copie a string `DATABASE_URL` (modo direto/sem pooler, se possível).
3. No projeto local:
   - `npx prisma db push`

## 2) Google OAuth (Login com Google)
No Google Cloud Console:
- Authorized JavaScript origins:
  - `https://SEU-DOMINIO`
- Authorized redirect URIs:
  - `https://SEU-DOMINIO/api/auth/callback/google`

## 3) Variáveis no Vercel
Em **Settings → Environment Variables**:
- `DATABASE_URL`
- `NEXTAUTH_URL=https://SEU-DOMINIO`
- `NEXTAUTH_SECRET` (string longa e aleatória)
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GEMINI_API_KEY` (opcional)
- `OPENAI_API_KEY` (opcional)
- SMTP (para recuperação de senha):
  - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM`

## 4) Deploy no Vercel
1. Importar repositório do GitHub.
2. Garantir branch `main`.
3. Rodar deploy.
4. Validar:
   - `GET https://SEU-DOMINIO/api/health`
   - Login Google em `https://SEU-DOMINIO/login`

## 5) Docker (local)
1. Copie `.env.example` para `.env` e preencha.
2. Suba:
   - `docker compose up --build`
3. Abra:
   - `http://localhost:3000`

