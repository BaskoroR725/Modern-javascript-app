const express = require('express');
const usersRepo = require('../../repository/users');

const router = express.Router();

router.get('/signup', (req, res) =>{
  res.send(`
      <div>
      Your id is ${req.session.userId}
        <form method='POST'>
          <input name="email" placeholder="email">
          <input name="password" placeholder="password">
          <input name="passwordConfirmation"placeholder="password confirmation">
          <button>Sign Up</button>
        </form>
      </div>
    `);
});

router.post('/signup', async (req,res) =>{
  const { email, password, passwordConfirmation } = req.body;

  const existingUser = await usersRepo.getOneBy({ email });

  if (existingUser){
    return res.send('Email in use');
  }

  if (password !== passwordConfirmation){
    return res.send('Passwords must match');
  }

  const user = await usersRepo.create({ email, password });

  req.session.userId = user.id;

  res.send('Account created!!!');
});

router.get('/signout', (req, res) =>{
  req.session = null;
  res.send('You are logged out');
});

router.get('/signin', (req, res) =>{
  res.send(`
    <div>
        <form method='POST'>
          <input name="email" placeholder="email">
          <input name="password" placeholder="password">
          <button>Sign In</button>
        </form>
      </div>
    `);
});

router.post('/signin', async (req, res) =>{
  const { email, password } = req.body;

  const user = await usersRepo.getOneBy({ email });

  if (!user){
    return res.send('Invalid Email');
  }

  const validPassword = await usersRepo.comparePassword(
    user.password,
    password
  );

  if(!validPassword){
    return res.send('Invalid Password')
  }

  //if email, password valid run this session
  req.session.userId = user.id;

  res.send('You are Sign in');
});

module.exports = router;