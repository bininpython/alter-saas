# Documentação de API (resumo)

Base URL:
- Local: `http://localhost:3000`
- Produção: seu domínio no Vercel

## Auth

### POST `/api/auth/register`
Cria usuário com email/senha.

Body:
```json
{ "name": "Nome", "email": "email@dominio.com", "password": "senha forte", "whatsapp": "(11) 99999-9999" }
```

Respostas:
- 200: `{ "user": { "id": "...", "name": "...", "email": "..." } }`
- 400: `{ "error": "Dados inválidos" | "Usuário já existe" }`
- 500: `{ "error": "Erro interno do servidor" }`

### POST `/api/auth/forgot-password`
Gera token e envia e-mail com link (se o e-mail existir).

Body:
```json
{ "email": "email@dominio.com" }
```

Resposta:
- 200: `{ "ok": true }`

### POST `/api/auth/reset-password`
Redefine senha a partir do token do link.

Body:
```json
{ "token": "hex...", "password": "nova senha forte" }
```

Respostas:
- 200: `{ "ok": true }`
- 400: `{ "error": "Token inválido ou expirado" | "Dados inválidos" }`

## User

### GET `/api/user/data`
Requer sessão (NextAuth).

Respostas:
- 200: `{ user, lastWorkout, recentCheckins }`
- 401: `{ "error": "Não autorizado" }`

## IA

### POST `/api/gemini/chat`
Requer sessão. Retorna resposta do Gemini.

Body:
```json
{ "message": "..." }
```

Respostas:
- 200: `{ "response": "..." }`
- 401: `{ "error": "Não autorizado" }`

## Health

### GET `/api/health`
Testa conexão com o banco.

Respostas:
- 200: `{ "ok": true }`
- 500: `{ "ok": false, "error": "...", "details": "..." }`

