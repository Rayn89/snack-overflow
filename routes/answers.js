const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");

const db = require("../db/models");
const { csrfProtection, asyncHandler } = require("./utils");
const { requireAuth } = require("../auth");

const answerValidator = [
    check("content")
        .exists( {checkFalsy: true})
        .withMessage("Please provide a valid answer")
];

// app.get('/:id(//')
router.post('/', requireAuth, csrfProtection, answerValidator, asyncHandler(async (req, res) => {
    const { content, userId, questionId, answerScore } = req.body;
    const answer = await db.Answer.build({ content, userId, questionId, answerScore });

    const validatorErrors = validationResult(req);

    if (validatorErrors.isEmpty()) {
        await answer.save();
        res.redirect(`/questions/${questionId}`)
    } else {
        const question = await db.Question.findByPk(questionId);
        const errors = validatorErrors.array().map((error) => error.msg)
        res.render('question', {
            answer,
            question,
            errors,
            csrfToken: req.csrfToken(),
        })
    }
}));

router.get('/:id(\\d+)/edit', requireAuth, csrfProtection, asyncHandler(async (req, res) => {
    const answerId = parseInt(req.params.id, 10);
    const { content } = req.body;
    const answer = await db.Answer.findByPk(answerId, {
        include: db.User
    });

    if (res.locals.user.id !== answer.userId) {
        const err = new Error('Not authorized');
        err.status = 401;
        throw err
    }
    res.render("answer-edit", { answer, csrfToken: req.csrfToken() })
}));







module.exports = router;