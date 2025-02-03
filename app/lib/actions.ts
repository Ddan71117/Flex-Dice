'use server'
import { sql } from '@vercel/postgres'
import { User } from './definitions'
import bcrypt from 'bcryptjs';
import { signIn } from '../../auth'
import { AuthError } from 'next-auth'
import { signOut as authSignOut  } from '../../auth'




export async function createUser(prevState: string | undefined, formData: FormData) {
    console.log(process.env.POSTGRES_URL)
    if (!process.env.POSTGRES_URL) {
        throw new Error("Missing database connection string.");
      }
    const name = formData.get('name')?.toString();
    const email = formData.get('email')?.toString();
    const password = formData.get('password')?.toString();

    if(!name || !email || !password) {
        return 'All fields are required'
    }

    if (password.length < 6) {
        return 'Password must be at least 6 characters long.';
        
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        await sql<User>`
        INSERT INTO users1 (name, email, password)
        VALUES (${name}, ${email}, ${hashedPassword})
        `
    } catch (error) {
        console.error('Failed to create user:', error)
        throw new Error('Failed to create user.')
    }
    
}


export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
  ) {
    try {
            const email = formData.get('email')?.toString();
            const password = formData.get('password')?.toString();
        
            if (!email || !password) {
              return 'All fields are required.';
            }
      await signIn('credentials', formData);
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case 'CredentialsSignin':
            return 'Invalid credentials.';
          default:
            return 'Something went wrong.';
        }
      }
      throw error;
    }
  }

  export async function serverSignOut() {
    return authSignOut();
  }

  