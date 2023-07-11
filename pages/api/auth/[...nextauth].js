import NextAuth from "next-auth";
// import GithubProvider from "next-auth/providers/github";
import StravaProvider from "next-auth/providers/strava";

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    // GithubProvider({
    //   clientId: process.env.GITHUB_ID,
    //   clientSecret: process.env.GITHUB_SECRET,
    // }),
    StravaProvider({
      clientId: process.env.NEXT_PUBLIC_STRAVA_ID,
      clientSecret: process.env.NEXT_PUBLIC_STRAVA_SECRET,
    }),
    // ...add more providers here
  ],
};

export default NextAuth(authOptions);
