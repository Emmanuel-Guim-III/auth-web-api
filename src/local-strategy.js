import passport from 'passport';
import Strategy from 'passport-local';
import { mockUsers } from './mockUsers.js';

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  try {
    const findUser = mockUsers.find((user) => user.id === id);
    if (!findUser) throw new Error('User not found');
    done(null, findUser);
  } catch (error) {
    done(error, null);
  }
});

export default passport.use(
  new Strategy((username, password, done) => {
    const findUser = mockUsers.find((user) => user.username === username);

    try {
      if (!findUser || findUser.password !== password) {
        throw new Error('Invalid Credentials');
      }

      done(null, findUser);
    } catch (error) {
      return done(error, null);
    }
  })
);
