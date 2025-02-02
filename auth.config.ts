import type { NextAuthConfig }  from 'next-auth';
 
export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      console.log('auth:', auth)
      console.log('nexturl:', nextUrl)
      const isInGame = nextUrl.pathname.startsWith('/gamepage');
      if (isInGame) {
        if (isLoggedIn) return true;
        console.log(isLoggedIn)
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/gamepage', nextUrl));
      }
      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;