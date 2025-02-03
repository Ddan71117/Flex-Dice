import type { NextAuthConfig }  from 'next-auth';
 
export const authConfig = {
  pages: {
    signIn: '/',
  },
  
  callbacks: {
      async signIn({ user, account, profile, email, credentials }) {
        console.log('signIn callback - user:', user);
        console.log('signIn callback - account:', account);
        console.log('signIn callback - credentials:', credentials);
        return true;
      },
        async session({ session, token, user }) {
          console.log('session callback - session:', session);
          console.log('session callback - token:', token);
          console.log('session callback - user:', user);
          return session;
      },
      
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