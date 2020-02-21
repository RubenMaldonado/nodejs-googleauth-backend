const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose')
const keys = require('./keys')
// Load User Model
const UserModel = mongoose.model('users')

module.exports = function(passport) {
  passport.use(
    new GoogleStrategy({
      clientID:     keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: "/auth/google/callback",
      proxy: true
    }, (accessToken, refreshToken, profile, done) => {
      console.log(accessToken);
      console.log(profile);

      const image = profile.photos[0].value
      console.log(image)

      const newUser = {
        googleID: profile.id,
        email: profile.emails[0].value,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        image: image
      };

      //Check if the user already exist
      UserModel.findOne({
        googleID: profile.id
      }).then(user => {
        if(user){
          // Return user
          done(null, user)
        } else {
          // Create user
          new UserModel(newUser)
            .save()
            .then(user => done(null, user));
        }
      })
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    UserModel.findById(id).then(user => done(null, user));
  });
}