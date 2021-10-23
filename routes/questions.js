const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");

const db = require("../db/models");
const { csrfProtection, asyncHandler } = require("./utils");
const { requireAuth } = require("../auth");

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const questions = await db.Question.findAll({
      include: db.User,
      limit: 20,
      order: [["updatedAt", "DESC"]],
    });

    res.render("questions-list", {
      questions,
    });
  })
);

const contentValidator = [
  check("content")
    .exists({ checkFalsy: true })
    .withMessage("Please fill in the form"),
];

const questionValidator = [
  check("title")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a title")
    .isLength({ max: 255 })
    .withMessage("Title must not be more than 255 characters long"),
  check("content")
    .exists({ checkFalsy: true })
    .withMessage("Please fill in the form"),
];

router.get(
  "/ask",
  requireAuth,
  csrfProtection,
  asyncHandler(async (req, res) => {
    const question = db.Question.build();
    res.render("question-ask", {
      // title: "",
      question,
      csrfToken: req.csrfToken(),
    });
  })
);

router.post(
  "/ask",
  requireAuth,
  csrfProtection,
  questionValidator,
  asyncHandler(async (req, res) => {
    const { title, content, userId } = req.body;

    const question = db.Question.build({ title, content, userId });
    const validatorErrors = validationResult(req);

    if (validatorErrors.isEmpty()) {
      await question.save();
      res.redirect(`/questions/${question.id}`);
    } else {
      const errors = validatorErrors.array().map((error) => error.msg);
      res.render("question-ask", {
        question,
        errors,
        csrfToken: req.csrfToken(),
      });
    }
  })
);

router.get(
  "/:id(\\d+)",
  csrfProtection,
  asyncHandler(async (req, res) => {
    const questionId = parseInt(req.params.id, 10);
    const question = await db.Question.findByPk(questionId, {
      include: db.User,
    });
    const answers = await db.Answer.findAll({
      order:[['createdAt', 'ASC']],
      include: [db.User],
      where: { questionId },
    });
    res.render("question", { question, answers, csrfToken: req.csrfToken() });
  })
);

router.get(
  "/:id(\\d+)/edit",
  requireAuth,
  csrfProtection,
  asyncHandler(async (req, res) => {
    const questionId = parseInt(req.params.id, 10);
    const question = await db.Question.findByPk(questionId, {
      include: db.User,
    });

    if (!question) {
      const err = new Error("Not Found");
      err.status = 404;
      throw err;
    }
    if (res.locals.user.id !== question.userId) {
      const err = new Error("Not Authorized");
      err.status = 401;
      throw err;
    }
    res.render("question-edit", { question, csrfToken: req.csrfToken() });
  })
);

router.post(
  "/:id(\\d+)/edit",
  requireAuth,
  questionValidator,
  csrfProtection,
  asyncHandler(async (req, res) => {
    const questionId = parseInt(req.params.id, 10);
    const question = await db.Question.findByPk(questionId, {
      include: db.User,
    });

    const { title, content } = req.body;

    const updatedQuestion = {
      title,
      content,
    };

    if (!question) {
      const err = new Error("Not Found");
      err.status = 404;
      throw err;
    }
    if (res.locals.user.id !== question.userId) {
      const err = new Error("Not Authorized");
      err.status = 401;
      throw err;
    }

    const validatorErrors = validationResult(req);

    if (validatorErrors.isEmpty()) {
      await question.update(updatedQuestion);
      res.redirect(`/questions/${questionId}`);
    } else {
      const errors = validatorErrors.array().map((error) => error.msg);
      res.render("question-edit", {
        question,
        updatedQuestion,
        errors,
        csrfToken: req.csrfToken(),
      });
    }
  })
);

router.get(
  "/:id(\\d+)/delete",
  requireAuth,
  asyncHandler(async (req, res) => {
    const questionId = parseInt(req.params.id, 10);
    const question = await db.Question.findByPk(questionId);

    if (!question) {
      const err = new Error("Not Found");
      err.status = 404;
      throw err;
    }
    if (res.locals.user.id !== question.userId) {
      const err = new Error("Not Authorized");
      err.status = 401;
      throw err;
    }

    res.render("question-delete", { question });
  })
);

router.post(
  "/:id(\\d+)/delete",
  requireAuth,
  asyncHandler(async (req, res) => {
    const questionId = parseInt(req.params.id, 10);
    const question = await db.Question.findByPk(questionId);

    if (!question) {
      const err = new Error("Not Found");
      err.status = 404;
      throw err;
    }
    if (res.locals.user.id !== question.userId) {
      const err = new Error("Not Authorized");
      err.status = 401;
      throw err;
    }

    const answers = await db.Answer.findAll({
      where: { questionId },
    });

    let answerIds = answers.map((answer) => {
      return answer.dataValues.id;
    });

    await db.Vote.destroy({
      where: {
        answerId: answerIds,
      },
    });

    await db.Answer.destroy({
      where: {
        questionId,
      },
    });

    await question.destroy();
    res.redirect("/questions");
  })
);

module.exports = router;
