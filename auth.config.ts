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
      } else if (isLoggedIn && nextUrl.pathname !== '/rules') {
        return Response.redirect(new URL('/rules', nextUrl));
      }
      return true;
    },
    async redirect({ url, baseUrl }) {
      console.log("Redirect callback - url:", url);
      console.log("Redirect callback - baseUrl:", baseUrl);
      if (url === baseUrl || url.startsWith(baseUrl)) {
        return baseUrl; // Redirect to home page after logout
      }
      if (url === baseUrl + '/rules') {
        return url; // Ensure the URL is correctly set to /rules after login
      }
      // Redirect to rules page after login
      return baseUrl + '/rules';
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;