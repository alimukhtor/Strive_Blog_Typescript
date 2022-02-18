import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import { JWTAuthenticate } from "./tools";
import AuthorsModel from "../authors/schema";
process.env.TS_NODE_DEV && require("dotenv").config();
const { GOOGLE_CLIENT_ID } = process.env;
console.log(process.env.GOOGLE_CLIENT_ID);

const googleStrategy = new GoogleStrategy.Strategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: `${process.env.CALLBACK_URL}/authors/googleRedirect`,
  },

  async (
    accessToken: string,
    refreshToken: string,
    profile: any,
    passportNext: any
  ) => {
    try {
      console.log("Profile: ", profile);

      const author = await AuthorsModel.findOne({ googleId: profile.id });
      if (author) {
        console.log("passport.initialize()");
        const token = await JWTAuthenticate(author);
        passportNext(null, { token });
      } else {
        const newUser = new AuthorsModel({
          first_name: profile.name.givenName,
          last_name: profile.name.familyName,
          email: profile.emails[0].value,
          googleId: profile.id,
        });

        console.log("as", newUser);

        const token = await JWTAuthenticate(newUser);
        console.log(token);
        passportNext(null, { token });
      }
    } catch (error) {
      passportNext(error);
    }
  }
);

passport.serializeUser(function (data, passportNext) {
  passportNext(null, data);
});

export default googleStrategy;
