import passport from 'passport'
import GoogleStrategy from 'passport-google-oauth20'
import {JWTAuthenticate} from '../userAuth/tools.js'
import AuthorsModel from '../authors/schema.js'

// console.log(process.env.JWT_CLIENT_ID);
const googleStrategy = new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.CALLBACK_URL}/authors/googleRedirect`,
},

    async(accessToken, refreshToken, profile, passportNext)=> {
        try {
            console.log("Profile: ", profile);

            const author = await AuthorsModel.findOne({googleId:profile.id})
            if(author){
                console.log("passport.initialize()")
                const token = await JWTAuthenticate(author)
                passportNext(null, {token})
            }else{
                const newUser = new AuthorsModel({
                    first_name: profile.name.givenName,
                    last_name: profile.name.familyName,
                    email: profile.emails[0].value,
                    googleId: profile.id,
                })
                
                console.log("as", newUser);
                // const savedUser = await newUser.save()
                // console.log("as", newUser);
                const token = await JWTAuthenticate(newUser)
                console.log(token);
                passportNext(null, { token })
            }
        } catch (error) {
            // passportNext(error)
        }
    }
)

passport.serializeUser(function (data, passportNext) {
    passportNext(null, data)
  })

  
export default googleStrategy