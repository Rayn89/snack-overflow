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






module.exports = router;
