import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook"
import GithubProvider from "next-auth/providers/github"
import TwitterProvider from "next-auth/providers/twitter"
import Auth0Provider from "next-auth/providers/auth0"
import DuendeIDS6Provider from "next-auth/providers/duende-identity-server6"
import DuendeIdentityServer6 from "next-auth/providers/duende-identity-server6"
import CredentialsProvider from "next-auth/providers/credentials";

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export const authOptions: NextAuthOptions = {
  // https://next-auth.js.org/configuration/providers/oauth
  providers: [
    CredentialsProvider({
      name: "Credentials Demo",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "alice" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const reqData = {
          ...credentials,
          client_id: "nextjs_web_app",
          scope: "openid profile offline_access marketplace",
          grant_type: "password",
        } as any
        let formBody = []
        for (let property in reqData) {
          let encodedKey = encodeURIComponent(property)
          let encodedValue = encodeURIComponent(reqData[property])
          formBody.push(encodedKey + "=" + encodedValue)
        }
        const formBodyStr = formBody.join("&")
        try {
          const res = await fetch("https://localhost:5001/connect/token", {
            method: "POST",
            body: formBodyStr,
            headers: {
              "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
            },
          })
          const response= await res.json()
          // If no error and we have user data, return it
          if (res.ok && response) {
            return response
          }
          // Return null if user data could not be retrieved
          console.log("sdfsdfsd")
          return null

        } catch (error) {
          console.log(error);
        }
      },
    }),
    Auth0Provider({
      clientId: process.env.AUTH0_ID,
      clientSecret: process.env.AUTH0_SECRET,
      issuer: process.env.AUTH0_ISSUER,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    TwitterProvider({
      clientId: process.env.TWITTER_ID,
      clientSecret: process.env.TWITTER_SECRET,
      version: "2.0",
    }),
  ],
  callbacks: {
    async jwt({ token }) {
      token.userRole = "admin"
      return token
    },
  },
}

export default NextAuth(authOptions)
