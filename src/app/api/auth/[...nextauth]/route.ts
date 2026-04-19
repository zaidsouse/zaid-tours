import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

const clientId = process.env.GOOGLE_CLIENT_ID ?? ''
const clientSecret = process.env.GOOGLE_CLIENT_SECRET ?? ''
const secret = process.env.NEXTAUTH_SECRET ?? 'zaid-tours-fallback-secret-change-in-prod'

const handler = NextAuth({
  providers: clientId && clientSecret ? [
    GoogleProvider({ clientId, clientSecret }),
  ] : [],
  secret,
  callbacks: {
    async redirect({ baseUrl }) {
      return baseUrl + '/auth/google-success'
    },
  },
})

export { handler as GET, handler as POST }
