import type { NextAuthConfig } from 'next-auth';
 
export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async signIn() {
      
      return true;
    },
    async jwt({ token, user}) {
      if(user){
         token.user = user;
      }
      return token;
    },
    async session({ session}) {
      
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isInGame = nextUrl.pathname.startsWith('/game');
      if (isInGame) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isInGame) {
        return Response.redirect(new URL('/game', nextUrl));
      }
      return true;

   
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;