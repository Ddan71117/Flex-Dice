// import type { NextRequest, NextResponse } from 'next/server'
// import { nanoid } from 'nanoid'
// import { SignJWT, jwtVerify } from 'jose'
// import { USER_TOKEN, getJwtSecretKey } from '@/app/lib/constants'
// import { jsonResponse } from '@/app/lib/utils'

// interface UserJwtPayload {
//   jti: string
//   iat: number
// }

// export class AuthError extends Error {}

// /**
//  * Verifies the user's JWT token and returns its payload if it's valid.
//  */
// export async function verifyAuth(req: NextRequest) {
//   const token = req.cookies.get(USER_TOKEN)?.value

//   if (!token) throw new AuthError('Missing user token')

//   try {
//     const verified = await jwtVerify(
//       token,
//       new TextEncoder().encode(getJwtSecretKey())
//     )
//     return verified.payload as UserJwtPayload
//   } catch (err) {
//     throw new AuthError('Your token has expired.')
//   }
// }

// /**
//  * Adds the user token cookie to a response.
//  */
// export async function setUserCookie(res: NextResponse) {
//   const token = await new SignJWT({})
//     .setProtectedHeader({ alg: 'HS256' })
//     .setJti(nanoid())
//     .setIssuedAt()
//     .setExpirationTime('2h')
//     .sign(new TextEncoder().encode(getJwtSecretKey()))

//   res.cookies.set(USER_TOKEN, token, {
//     httpOnly: true,
//     maxAge: 60 * 60 * 2, // 2 hours in seconds
//   })
//   console.log(USER_TOKEN, token)
//   return res
// }

// /**
//  * Expires the user token cookie
//  */
// export function expireUserCookie(res: NextResponse) {
//   res.cookies.set(USER_TOKEN, '', { httpOnly: true, maxAge: 0 })
//   return res
// }



// export const config = {
//   runtime: 'edge',
// }

// export default async function auth(req: NextRequest) {
//   if (req.method !== 'POST') {
//     return jsonResponse(405, { error: { message: 'Method not allowed' } })
//   }

//   try {
//     return await setUserCookie(jsonResponse(200, { success: true }))
//   } catch (err) {
//     console.error(err)
//     return jsonResponse(500, { error: { message: 'Authentication failed.' } })
//   }
// }

import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { sql } from '@vercel/postgres';
import type { User } from './app/lib/definitions';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

async function getUser(username: string): Promise<User | undefined> {
  try {
      
    const user = await sql<User>`SELECT * FROM users WHERE username=${username}`;
    return user.rows[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
  
}

export const { auth, signIn, signOut } = NextAuth({
...authConfig,

providers: [Credentials({
  async authorize(credentials) {
      const parsedCredentials = z
          .object({ username: z.string().min(1), password: z.string().min(1) })
          .safeParse(credentials);
          
          console.log('credentials:', credentials)
          console.log('Parsed credentials:', parsedCredentials)
          
          if (parsedCredentials.success) {
              const { username, password } = parsedCredentials.data;
              const user = await getUser(username);
              if (!user) return null;
              const passwordsMatch = await bcrypt.compare(password, user.password);
              if (passwordsMatch) return user;

            }
              console.log('Invalid credentials')
            return null;
          }
      })
  ],

});