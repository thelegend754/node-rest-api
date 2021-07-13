const express = require('express');
const _ = require('lodash');
const { Card, validateCard,generateRandomNumber } = require('../models/card');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/my-cards', auth, async (req, res) => {

  if( ! req.user.biz ) return res.status(401).send('Access denied.');
  const cards = await Card.find({ user_id: req.user._id });
  res.send(cards);

});


router.delete('/:id', auth, async (req, res) => {

 const card = await Card.findOneAndRemove({_id: req.params.id, user_id: req.user._id});
if(! card) return res.status(404).send('The card with the given ID not found.');

res.send(card);
});


router.put('/:id', auth, async (req, res) => {

  const { error } = validateCard(req.body);
  if( error ) return res.status(400).send(error.details[0].message);

  let card = await Card.findOneAndUpdate({_id: req.params.id, user_id: req.user._id }, req.body);
  if( ! card ) return res.status(404).send('The card with the given ID not found.');

card = await Card.findOne({_id: req.params.id, user_id: req.user._id});

  res.send(card);

});



router.get('/:id', auth, async (req,res)=>{

const card = await Card.findOne({ _id: req.params.id, user_id: req.user._id });
if(! card ) return res.status(404).send('The card with the given ID not found.');
res.send(card);
});

router.post('/', auth, async(req,res)=>{

const { error } = validateCard(req.body);
if( error ) return res.status(400).send(error.details[0].message);

let card = new Card({
    bizName: req.body.bizName,
    bizDescription: req.body.bizDescription,
    bizAddress: req.body.bizAddress,
    bizPhone: req.body.bizPhone,
    bizImage: req.body.bizImage ? req.body.bizImage: 'https://cdn.pixabay.com/photo/2015/10/30/10/03/app-1013616_960_720.jpg',
    bizNumber: await generateRandomNumber(Card),
    user_id: req.user._id
  });

  let post = await card.save();
  res.send(post);


/*
const randomNumber = await generateRandomNumber(Card);
res.send(randomNumber);
*/
});

module.exports=router;
