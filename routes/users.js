const express = require('express');
const router = express.Router();
const { User, validate } = require('../models/user');
//para claves
const bcrypt=require('bcrypt');
const _=require('lodash');
const auth = require('../middleware/auth');

//async es el next en midlerware
router.get('/me', auth, async (req, res) => {

  const user = await User.findById(req.user._id).select('-password');
  res.send(user);

});

router.post('/', async (req, res) => {

  const { error } = validate(req.body);
  if( error ) return res.status(400).send( error.details[0].message );
  
  let user = await User.findOne({ email: req.body.email });
  if( user ) return res.status(400).send('User already register.');

  user= new User(req.body)
  const salt=await bcrypt.genSalt(10);
user.password=await bcrypt.hash(user.password,salt);
await user.save();
res.send(_.pick(user,['_id','name','email']));

});

module.exports = router;