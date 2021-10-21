const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { asyncHandler } = require('./utils')
const db = require('../db/models')

/* GET home page. */
router.get('/', asyncHandler(async(req, res) => {
    const questions = await db.Question.findAll({
      include: db.User
    });

    res.render("index", { questions });
}));

router.get('/search', asyncHandler(async(req, res) => {
  const { term } = req.query;
  const questions = await db.Question.findAll({where: {title: {[Op.like]:'%' + term + '%'}}, include: db.User})
  res.render('search', {questions, term})
}));

router.post("/vote/:answerId/:type",asyncHandler(async (req, res)=>{
  const type = req.params.type;
  const answerId = req.params.answerId;
  let answer = await db.Answer.findByPk(answerId);
  let vote =await db.Vote.findOne({
    where:{
      answerId,
      userId: req.session.auth.userId,
    }
  })

  if(!vote){
    vote = await db.Vote.create({
      userId: req.session.auth.userId,
      answerId,
      up: type === "up" ? true : false,
      down: type === "down" ? true : false
    })
    return res.json(vote)
  }

  if( type === "up"){

    if(vote.down === true){
      await answer.update({
        answerScore:answer.answerScore+1
      })
      await vote.update({
        down:false
      })
      // return res.json({...vote, answerScore : answer.answerScore})
    }
    //if vote.down === true then
      //update answer.voteCount +1
      //vote.down = false

      console.log("answer:",answer.dataValues)
      console.log("vote:",vote.dataValues)
      if(vote.up === true){
        await answer.update({
          answerScore:answer.answerScore-1
        })
        await vote.update({
          up:false
        })
        return res.json({ answerScore : answer.answerScore,...vote})
      }

      console.log("after:")
      console.log("answer:",answer.dataValues)
      console.log("vote:",vote.dataValues)

    //if vote.up === true then
      //decrement answer.voteCount
      //update vote.up to be false

    if(vote.up === false){
      await answer.update({
        answerScore:answer.answerScore+1
      })
      await vote.update({
        up:true
      })
      return res.json({ answerScore : answer.answerScore,...vote})
    }
    //if vote.up === false then
      //increment answer.voteCount
      //update vote.up to be true

  }else if(type === "down"){

    if(vote.up === true){
      console.log("downnn")
      await answer.update({
        answerScore:answer.answerScore-1
      })
      await vote.update({
        up:false
      })
      // return res.json(vote)
    }

    if(vote.down === true){
      await answer.update({
        answerScore:answer.answerScore+1
      })
      await vote.update({
        down:false
      })
      return res.json(vote)
    }

    if(vote.down === false){
      await answer.update({
        answerScore:answer.answerScore-1
      })
      await vote.update({
        down:true
      })
      return res.json(vote)
    }
  }else{
    return res.send('why?')
  }

  return res.json(vote)
}))




module.exports = router;
