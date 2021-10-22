const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");

const db = require("../db/models");
const { csrfProtection, asyncHandler } = require("./utils");
const { requireAuth } = require("../auth");

const answerValidator = [
  check("content")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a valid answer"),
];

router.post(
  "/",
  requireAuth,
  csrfProtection,
  answerValidator,
  asyncHandler(async (req, res) => {
    const { content, userId, questionId, answerScore } = req.body;
    const answer = await db.Answer.build({
      content,
      userId,
      questionId,
      answerScore,
    });

    const validatorErrors = validationResult(req);

    if (validatorErrors.isEmpty()) {
      await answer.save();
      res.redirect(`/questions/${questionId}`);
    } else {
      const question = await db.Question.findByPk(questionId, {
        include: db.User,
      });
      const errors = validatorErrors.array().map((error) => error.msg);
      res.render("bad-answer", {
        answer,
        question,
        errors,
        csrfToken: req.csrfToken(),
      });
    }
  })
);

router.get(
  "/:id(\\d+)/edit",
  requireAuth,
  csrfProtection,
  asyncHandler(async (req, res) => {
    const answerId = parseInt(req.params.id, 10);
    const { content } = req.body;
    const answer = await db.Answer.findByPk(answerId, {
      include: db.User,
    });

    if (!answer) {
      const err = new Error("Not Found");
      err.status = 404;
      throw err;
    }
    if (res.locals.user.id !== answer.userId) {
      const err = new Error("Not Authorized");
      err.status = 401;
      throw err;
    }
    res.render("answer-edit", { answer, csrfToken: req.csrfToken() });
  })
);

router.post(
  "/:id(\\d+)/edit",
  requireAuth,
  csrfProtection,
  asyncHandler(async (req, res) => {
    const answerId = parseInt(req.params.id, 10);
    const { content } = req.body;
    const answer = await db.Answer.findByPk(answerId, {
      include: db.User,
    });
    if (!answer) {
      const err = new Error("Not Found");
      err.status = 404;
      throw err;
    }
    if (res.locals.user.id !== answer.userId) {
      const err = new Error("Not Authorized");
      err.status = 401;
      throw err;
    }
    await answer.update({ content });
    res.redirect(`/questions/${answer.questionId}`);
  })
);

router.get(
  "/:id(\\d+)/delete",
  requireAuth,
  asyncHandler(async (req, res) => {
    const answerId = parseInt(req.params.id, 10);
    const answer = await db.Answer.findByPk(answerId);

    if (!answer) {
      const err = new Error("Not Found");
      err.status = 404;
      throw err;
    }
    if (res.locals.user.id !== answer.userId) {
      const err = new Error("Not Authorized");
      err.status = 401;
      throw err;
    }

    res.render("answer-delete", { answer });
  })
);

router.post(
  "/:id(\\d+)/delete",
  requireAuth,
  asyncHandler(async (req, res) => {
    const answerId = parseInt(req.params.id, 10);
    const answer = await db.Answer.findByPk(answerId);
    const { questionId } = answer;

    if (!answer) {
      const err = new Error("Not Found");
      err.status = 404;
      throw err;
    }
    if (res.locals.user.id !== answer.userId) {
      const err = new Error("Not Authorized");
      err.status = 401;
      throw err;
    }

    await db.Vote.destroy({
      where:{
        answerId
      }
    })

    await answer.destroy();
    res.redirect(`/questions/${questionId}`);
  })
);

module.exports = router;
