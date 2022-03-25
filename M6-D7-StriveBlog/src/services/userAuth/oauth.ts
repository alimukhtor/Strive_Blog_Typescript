import passport from "passport";
import { Strategy } from "passport-google-oauth20";
import { JWTAuthenticate } from "./tools";
import AuthorsModel from "../authors/schema";

const googleStrategy = new Strategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    callbackURL: `${process.env.CALLBACK_URL}/authors/googleRedirect`,
    passReqToCallback: true
  },

  async function(accessToken, refreshToken, profile, passportNext) {
    try {
      console.log("Profile: ", profile);
      if (profile.emails && profile.emails.length > 0) {
        const author = await AuthorsModel.findOne({ email: profile.emails[0] });
        if (author) {
          console.log("passport.initialize()");
          const token = await JWTAuthenticate(author);
          passportNext(null, { token, role: author.role });
        } else {
          const newUser = new AuthorsModel({
            first_name: profile.name?.givenName,
            last_name: profile.name?.familyName,
            email: profile.emails[0].value,
            googleId: profile.id,
          });

          console.log("as", newUser);

          const token = await JWTAuthenticate(newUser);
          console.log(token);
          passportNext(null, { token });
        }
      }
    } catch (error: any) {
      passportNext(error);
    }
  }
);

passport.serializeUser(function (data, passportNext) {
  passportNext(null, data);
});

export default googleStrategy;
