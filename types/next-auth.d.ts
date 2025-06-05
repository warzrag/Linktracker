import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      username: string
    }
  }

  interface User {
    id: string
    email: string
    name?: string | null
    username: string
  }
}