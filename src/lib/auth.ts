import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "./prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Credenciais inválidas");
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user) {
          throw new Error("Usuário não encontrado");
        }

        if (!user.password) {
          throw new Error("Conta criada via Google. Use 'Entrar com Google' ou defina uma senha.");
        }

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordCorrect) {
          throw new Error("Senha incorreta");
        }

        return user;
      },
    }),
  ],
  events: {
    async signIn({ user }) {
      try {
        await prisma.auditLog.create({
          data: { userId: user?.id, action: "auth.signin" },
        });
      } catch {}
    },
    async signOut({ token }) {
      try {
        await prisma.auditLog.create({
          data: { userId: token?.sub || null, action: "auth.signout" },
        });
      } catch {}
    },
    async createUser({ user }) {
      try {
        await prisma.auditLog.create({
          data: { userId: user?.id, action: "auth.create_user" },
        });
      } catch {}
    },
    async linkAccount({ user, account }) {
      try {
        await prisma.auditLog.create({
          data: {
            userId: user?.id,
            action: "auth.link_account",
            metadata: { provider: account?.provider },
          },
        });
      } catch {}
    },
  },
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.sub;
        (session.user as any).role = (token as any).role;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        (token as any).role = (user as any).role || "user";
      }
      return token;
    },
  },
  debug: process.env.NODE_ENV === "development",
};
