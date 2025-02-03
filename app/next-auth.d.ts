// next-auth.d.ts

import NextAuth from "next-auth";
import { User } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
    };
  }

  interface User {
    id: string;
    username: string;
  }

  interface JWT {
    id: string;
    username: string;
  }
}
