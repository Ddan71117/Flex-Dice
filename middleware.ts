// import { type NextRequest, NextResponse } from 'next/server'
// import { verifyAuth } from '@/app/lib/auth'

// export const config = {
//   matcher: [ '/game', '/protected' ],
// }

// export async function middleware(req: NextRequest) {
//   // validate the user is authenticated
//   console.log('Middleware triggered for:', req.nextUrl.pathname);

//   const verifiedToken = await verifyAuth(req).catch((err) => {
//     console.error('Token verification error:', err.message)
//   })
  
//   if (!verifiedToken) {
//     // if this an API request, respond with JSON
//     if (req.nextUrl.pathname.startsWith('/game')) {
//       return new NextResponse(
//         JSON.stringify({ 'error': { message: 'authentication required' } }),
//         { status: 401 });
//     }
//     // otherwise, redirect to the set token page
//     else {
//       return NextResponse.redirect(new URL('/login', req.url))
//     }
//   }

//   console.log('Token verified:', verifiedToken);
// }

import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
console.log("Middleware loaded", authConfig);
 
export default NextAuth(authConfig).auth;
 
export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
