const express = require('express');

const { handleErrors } = require('./middlewares');
const usersRepo = require('../../repository/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');
const { 
  requireEmail, 
  requirePassword, 
  requirePasswordConfirmation,
  requireEmailExist,
  requireValidPasswordForUser
} = require('./validators');

const router = express.Router();

//SignUp

router.get('/signup', (req, res) =>{
  res.send(signupTemplate({ req }));
});

router.post('/signup', [
  requireEmail ,
  requirePassword,
  requirePasswordConfirmation], 
  handleErrors(signupTemplate),
  async (req,res) =>{
  const { email, password } = req.body;

  const user = await usersRepo.create({ email, password });

  req.session.userId = user.id;

  res.send('Account created!!!');
});

//SignOut

router.get('/signout', (req, res) =>{
  req.session = null;
  res.send('You are logged out');
});

//SignIn

router.get('/signin', (req, res) =>{
  res.send(signinTemplate({}));
});

router.post('/signin',[
  requireEmailExist,
  requireValidPasswordForUser],
  handleErrors(signinTemplate),
async (req, res) =>{
  const { email } = req.body;

  const user = await usersRepo.getOneBy({ email });

  //if email, password valid run this session
  req.session.userId = user.id;

  res.send('You are Sign in');
});

module.exports = router;