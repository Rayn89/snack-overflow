const express = require("express");
const router = express.Router();
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const { asyncHandler } = require("./utils");
const db = require("../db/models");

/* GET home page. */
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const answers = await db.Answer.findAll({
      order: [["updatedAt", "DESC"]],
      include: [{ model: db.Question, include: db.User }],
    });

    const set = new Set();
    let sortedQuestions = [];

    answers.forEach((answer) => {
      if (!set.has(answer.Question.id)) {
        set.add(answer.Question.id);
        sortedQuestions.push(answer.Question);
      }
    });

    console.log(
      sortedQuestions.map((sortedQuestion) => sortedQuestion.dataValues)
    );

    if (sortedQuestions.length > 20) {
      sortedQuestions = sortedQuestions.slice(0, 20);
    }

    res.render("index", { sortedQuestions });
  })
);

router.get(
  "/search",
  asyncHandler(async (req, res) => {
    const { term } = req.query;
    const questions = await db.Question.findAll({
      where: {
        title: {
          [Op.iLike]: "%" + term + "%",
        },
      },
      include: db.User,
    });
    res.render("search", { questions, term });
  })
);

router.post(
  "/vote/:answerId/:type",
  asyncHandler(async (req, res) => {
    const type = req.params.type;
    const answerId = req.params.answerId;
    let answer = await db.Answer.findByPk(answerId);
    let vote = await db.Vote.findOne({
      where: {
        answerId,
        userId: req.session.auth.userId,
      },
    });

    if (type === "up") {
      if (!vote) {
        vote = await db.Vote.create({
          userId: req.session.auth.userId,
          answerId,
          up: true,
          down: false,
        });
        await answer.update({
          answerScore: answer.answerScore + 1,
        });
      } else if (vote.down === true) {
        await answer.update({
          answerScore: answer.answerScore + 2,
        });
        await vote.update({
          up: true,
          down: false,
        });
      } else if (vote.up === true) {
        await answer.update({
          answerScore: answer.answerScore - 1,
        });
        await vote.update({
          up: false,
          down: false,
        });
      } else if (vote.up === false) {
        await answer.update({
          answerScore: answer.answerScore + 1,
        });
        await vote.update({
          up: true,
          down: false,
        });
      }

      return res.json({
        answerScore: answer.answerScore,
        down: vote.down,
        up: vote.up,
        ...vote.dataValues,
      });
    } else if (type === "down") {
      if (!vote) {
        vote = await db.Vote.create({
          userId: req.session.auth.userId,
          answerId,
          up: false,
          down: true,
        });
        await answer.update({
          answerScore: answer.answerScore - 1,
        });
      } else if (vote.up === true) {
        await answer.update({
          answerScore: answer.answerScore - 2,
        });
        await vote.update({
          up: false,
          down: true,
        });
      } else if (vote.down === true) {
        await answer.update({
          answerScore: answer.answerScore + 1,
        });
        await vote.update({
          down: false,
          up: false,
        });
      } else if (vote.down === false) {
        await answer.update({
          answerScore: answer.answerScore - 1,
        });
        await vote.update({
          down: true,
          up: false,
        });
      }
      return res.json({ answerScore: answer.answerScore, ...vote.dataValues });
    } else {
      return res.json({
        answerScore: answer.answerScore,
        down: vote.down,
        up: vote.up,
        ...vote.dataValues,
      });
    }
  })
);


module.exports = router;
