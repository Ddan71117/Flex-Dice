import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { getUserByUsername } from "../../../lib/actions";

interface User {
  id: string;
  username: string;
  password: string;
}

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: Partial<Record<string, unknown>>): Promise<Omit<User, "password"> | null> {
        if (!credentials?.username || !credentials?.password) {
          console.error("Missing username or password");
          return null;
        }

        try {
          const username = String(credentials.username);
          const password = String(credentials.password);

          // Fetch user from database
          const result = await getUserByUsername(username);
          const user: User | undefined = result?.[0];

          if (!user) {
            console.error(`User with username ${username} not found.`);
            return null;
          }

          // Compare hashed password
          const isPasswordValid = await bcrypt.compare(password, user.password);
          if (!isPasswordValid) {
            console.error("Invalid password");
            return null;
          }

          // Return user data without password
          return { id: user.id, username: user.username };
        } catch (error) {
          console.error("Error during authentication:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (!session.user) {
        session.user = {} as any;
      }
      session.user.id = token.id as string;
      session.user.username = token.username as string;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
