import dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';
import passport from 'passport';

import './local-strategy.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 600000 * 60, // 1 hour
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  req.session.visited = true;
  res.status(201).send('Hello');
});

app.post('/api/auth', passport.authenticate('local'), (req, res) => {
  res.sendStatus(200);
});

app.get('/api/auth/status', (req, res) => {
  return req.user ? res.send(req.user) : res.sendStatus(401);
});

app.post('/api/auth/logout', (req, res) => {
  if (!req.user) return res.sendStatus(400);

  req.logout((err) => {
    if (err) return res.sendStatus(400);
    res.sendStatus(200);
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
